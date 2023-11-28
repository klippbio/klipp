// AuthContext.tsx
"use client";
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth, useUser } from "@clerk/nextjs";

// Define a type for authDetails
export interface AuthDetails {
  token: string | undefined;
  userId: string | undefined;
  storeUrl?: string | undefined;
  storeId?: string | undefined;
}

type RefreshAuthDetails = (storeUrl: string, storeId: string) => void;

const AuthContext = createContext<{
  authDetails: AuthDetails;
  refreshAuthDetails: RefreshAuthDetails;
}>({
  authDetails: {
    token: undefined,
    userId: undefined,
    storeUrl: undefined,
    storeId: undefined,
  },
  refreshAuthDetails: (_: string, __: string) => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [authDetails, setAuthDetails] = useState<AuthDetails>({
    userId: undefined,
    storeUrl: undefined,
    token: undefined,
    storeId: undefined,
  });

  // Function to refresh the token at a regular interval
  const refreshAuthToken = useCallback(async () => {
    const token = await getToken({ template: "klipp" });
    setAuthDetails((prevAuthDetails) => ({
      ...prevAuthDetails,
      token: token || prevAuthDetails.token,
    }));
  }, [setAuthDetails, getToken]); // add dependencies here

  // Refresh the token every minute (adjust this interval as needed)
  useEffect(() => {
    const tokenRefreshInterval = setInterval(refreshAuthToken, 300000);
    return () => {
      clearInterval(tokenRefreshInterval);
    };
  }, [getToken, refreshAuthToken]);

  const refreshAuthDetails: RefreshAuthDetails = (storeUrl, storeId) => {
    setAuthDetails({
      ...authDetails,
      storeUrl: storeUrl,
      storeId: storeId,
    });
  };

  useEffect(() => {
    (async () => {
      const token = await getToken({ template: "klipp" });
      setAuthDetails({
        token: token ?? undefined,
        userId: user?.id ?? undefined,
        storeUrl: (user?.publicMetadata?.storeUrl as string) ?? undefined,
        storeId: (user?.publicMetadata?.storeId as string) ?? undefined,
      });
    })();
  }, [getToken, user]);

  return (
    <AuthContext.Provider value={{ authDetails, refreshAuthDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthDetails = () => {
  const { authDetails } = useContext(AuthContext);
  return authDetails;
};

export const useRefreshAuthDetails = () => {
  const { refreshAuthDetails } = useContext(AuthContext);
  return refreshAuthDetails;
};

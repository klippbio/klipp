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
  token: string | null;
  userId: string | null;
  storeUrl?: string | null;
  storeId?: string | null;
}

type RefreshAuthDetails = (storeUrl: string, storeId: string) => void;

export const AuthContext = createContext<{
  authDetails: AuthDetails;
  refreshAuthDetails: RefreshAuthDetails;
}>({
  authDetails: {
    token: null,
    userId: null,
    storeUrl: null,
    storeId: null,
  },
  refreshAuthDetails: (_: string, __: string) => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [authDetails, setAuthDetails] = useState<AuthDetails>({
    userId: null,
    storeUrl: null,
    token: null,
    storeId: null,
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
        token: token ?? null,
        userId: user?.id ?? null,
        storeUrl: (user?.publicMetadata?.storeUrl as string) ?? null,
        storeId: (user?.publicMetadata?.storeId as string) ?? null,
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

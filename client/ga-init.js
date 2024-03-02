import ReactGA from "react-ga";

export const initGA = () => {
  const trackingID = "G-YHC4MB4DGZ"; // Replace with your Tracking ID
  ReactGA.initialize(trackingID);
};

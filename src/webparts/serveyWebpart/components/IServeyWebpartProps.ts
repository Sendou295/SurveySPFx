import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IServeyWebpartProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  userDisplayEmail: String;
  currentTime: Date;
  context: WebPartContext;
}

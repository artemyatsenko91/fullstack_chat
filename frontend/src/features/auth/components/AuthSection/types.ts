export interface IAuthorizationProps {
  token: string | null;
  handleDisconnect: () => void;
  setToken: React.Dispatch<React.SetStateAction<string | null>>
}

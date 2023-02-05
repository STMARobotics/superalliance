import ReactDOM from "react-dom/client";
import App from './App';

export default function ReconApp() {
  return (
    <App />
  );
}
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<ReconApp />);
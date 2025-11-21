import { Footer } from "../../components/layout/Footer";
import { HeaderService } from "../../components/layout/HeaderService";
import { AlertService } from "./alert-service";

export default function AlertsPage() {
    return(
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <HeaderService />
            <AlertService />
            <Footer />
        </div>
    );
}
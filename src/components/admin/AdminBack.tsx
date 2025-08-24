import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminBack() {
  const navigate = useNavigate();
  
  return (
    <button 
      onClick={() => navigate("/admin")} 
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
    >
      <ChevronLeft className="h-4 w-4" />
      Tillbaka till översikt
    </button>
  );
}
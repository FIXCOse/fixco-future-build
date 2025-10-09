import { useNavigate } from "react-router-dom";
import { QuoteFormModal } from "@/components/admin/QuoteFormModal";

export default function AdminQuotesNew() {
  const navigate = useNavigate();

  return (
    <div className="p-0">
      <QuoteFormModal
        open={true}
        onOpenChange={(open) => {
          if (!open) navigate("/admin/quotes");
        }}
        quote={null}
        onSuccess={(created) => {
          navigate(`/admin/quotes?new=${created.id}`, { replace: true });
        }}
      />
    </div>
  );
}

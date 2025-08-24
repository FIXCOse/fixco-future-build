import { Button } from "./ui/button";

export function DebugWizard() {
  const forceOpen = () => {
    console.log("[DEBUG] Force opening wizard");
    // @ts-ignore
    if (window.__WIZ) {
      // @ts-ignore
      window.__WIZ.getState().open({ 
        mode: 'book', 
        serviceName: 'DEBUG TEST',
        serviceId: 'debug-test' 
      });
    } else {
      console.error("[DEBUG] window.__WIZ not found!");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[10000]">
      <Button 
        onClick={forceOpen}
        className="bg-red-500 hover:bg-red-600 text-white font-bold"
      >
        🐛 Force Wizard
      </Button>
    </div>
  );
}
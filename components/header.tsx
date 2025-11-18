import { Button } from "@/components/ui/button";

export function Header() {
  const userEmail = "usuario@exemplo.com";

  const handleLogout = () => {
    // TODO: Implementar logout
    console.log("Logout clicked");
  };

  return (
    <header className="flex items-center justify-between border-b py-4">
      <div className="text-lg font-semibold">xphub</div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{userEmail}</span>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}

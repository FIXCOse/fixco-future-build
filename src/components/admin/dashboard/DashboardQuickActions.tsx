import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  ClipboardList, 
  MessageSquare, 
  UserCog, 
  DollarSign, 
  Briefcase, 
  Building2,
  Receipt
} from 'lucide-react';

export function DashboardQuickActions() {
  const actions = [
    { 
      title: 'Skapa offert', 
      icon: FileText, 
      path: '/admin/quotes-new',
      description: 'Ny offert',
      variant: 'default' as const,
    },
    { 
      title: 'Förfrågningar', 
      icon: ClipboardList, 
      path: '/admin/requests-quotes',
      description: 'Hantera förfrågningar',
      variant: 'outline' as const,
    },
    { 
      title: 'Offertfrågor', 
      icon: MessageSquare, 
      path: '/admin/quote-questions',
      description: 'Obesvarade frågor',
      variant: 'outline' as const,
    },
    { 
      title: 'Personal', 
      icon: UserCog, 
      path: '/admin/staff',
      description: 'Hantera personal',
      variant: 'outline' as const,
    },
    { 
      title: 'Löner', 
      icon: DollarSign, 
      path: '/admin/payroll',
      description: 'Lönerapporter',
      variant: 'outline' as const,
    },
    { 
      title: 'Jobbförfrågningar', 
      icon: Briefcase, 
      path: '/admin/job-requests',
      description: 'Hantera förfrågningar',
      variant: 'outline' as const,
    },
    { 
      title: 'Pågående projekt', 
      icon: Building2, 
      path: '/admin/ongoing-projects',
      description: 'Aktiva projekt',
      variant: 'outline' as const,
    },
    { 
      title: 'Fakturor', 
      icon: Receipt, 
      path: '/admin/invoices',
      description: 'Hantera fakturor',
      variant: 'outline' as const,
    },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action) => (
            <Link key={action.path} to={action.path}>
              <Button 
                variant={action.variant}
                className="w-full h-auto flex flex-col items-center gap-2 p-4"
              >
                <action.icon className="h-5 w-5" />
                <div className="text-center">
                  <div className="text-sm font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

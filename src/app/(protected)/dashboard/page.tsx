import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { DatePicker } from "./_components/date-picker";


const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session.user.clinic) {
    redirect("/clinic-form");
  }

  return (
   
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Dashboard</PageTitle>
            <PageDescription>
              Tenha uma visão geral da sua clínica.
            </PageDescription>
          </PageHeaderContent>
          <PageActions>
            <DatePicker />
          </PageActions>
        </PageHeader>
        <PageContent>
          <></>
        </PageContent>
      </PageContainer>
    
  );
};

export default DashboardPage;

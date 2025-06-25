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

import { getDashboard } from "@/data/get-dashboard";
import dayjs from "dayjs";
import StatsCards from "./_components/stats-cards";
import WithAuthentication from "@/hocs/with-authentication";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { appointmentsTableColumns } from "../appointments/_components/table-columns";
import { DataTable } from "@/components/ui/data-table";
import TopDoctors from "./_components/top-doctors";

interface DashboardPageProps {
  searchParams: Promise<{
    from: string;
    to: string;
  }>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { from, to } = await searchParams;
  if (!from || !to) {
    redirect(
      `/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs().add(1, "month").format("YYYY-MM-DD")}`,
    );
  }
  const {
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
    topDoctors,
    topSpecialties,
    todayAppointments,
    dailyAppointmentsData,
  } = await getDashboard({
    from,
    to,
    session: {
      user: {
        clinic: {
          id: session!.user.clinic!.id,
        },
      },
    },
  });

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
          <StatsCards
            totalRevenue={
              totalRevenue.total ? Number(totalRevenue.total) : null
            }
            totalAppointments={totalAppointments.total}
            totalPatients={totalPatients.total}
            totalDoctors={totalDoctors.total}
          />
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="text-muted-foreground" />
                  <CardTitle className="text-base">
                    Agendamentos de hoje
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={appointmentsTableColumns}
                  data={todayAppointments}
                />
              </CardContent>
            </Card>
            <TopDoctors doctors={topDoctors} />
        </PageContent>
      </PageContainer>
      
    
  );
};

export default DashboardPage;

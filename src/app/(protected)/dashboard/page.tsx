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
        </PageContent>
      </PageContainer>
    
  );
};

export default DashboardPage;

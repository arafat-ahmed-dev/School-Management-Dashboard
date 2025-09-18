import DataService from "@/services/data-service";
import ClientResultPage from "./ClientResultPage";

const ResultPage = async () => {
  try {
    console.log("🚀 Server: Loading result data...");
    const data = await DataService.getAllResultData();
    console.log("✅ Server: Data loaded successfully:", {
      dataSource: data._dataSource,
      studentsCount: data.students?.length,
      hasOverviewMetrics: !!data.overviewMetrics
    });

    return <ClientResultPage initialData={data} />;
  } catch (error) {
    console.error('❌ Server: Error loading result data:', error);
    return (
      <div className="m-2 mt-0 flex-1 rounded-md bg-white text-base md:m-4 md:p-4 md:text-lg">
        <div className="flex h-96 items-center justify-center">
          <div className="text-lg text-red-500">Error loading result data: {error instanceof Error ? error.message : 'Unknown error'}</div>
        </div>
      </div>
    );
  }
};

export default ResultPage;

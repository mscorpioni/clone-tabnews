import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();

  return responseBody;
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";
  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let DatabaseStatusText = "Carregando...";

  if (!isLoading && data) {
    DatabaseStatusText = (
      <>
        Versão: {data.dependencies.database.version}
        <br />
        Conexões abertas: {data.dependencies.database.opened_connections}
        <br />
        Conexões máximas: {data.dependencies.database.max_connections}
        <br />
      </>
    );
  }

  return (
    <>
      <h2>Database</h2>
      <p>{DatabaseStatusText}</p>
    </>
  );
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

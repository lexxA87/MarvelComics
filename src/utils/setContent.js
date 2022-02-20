import ErrorMessage from "../components/errorMessage/ErrorMessage";
import Spinner from "../components/spinner/Spinner";
import Skeleton from "../components/skeleton/Skeleton";

const setContent = (process, Component, data) => {
  switch (process) {
    case "loading":
      return <Spinner />;

    case "waiting":
      return <Skeleton />;

    case "confirmed":
      return <Component data={data} />;

    case "error":
      return <ErrorMessage />;

    default:
      throw new Error("Process not found");
  }
};

export default setContent;

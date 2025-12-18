import { Link } from "react-router-dom";

function NoteFound() {
  return (
    <div className="flex flex-col items-center justify-center text-sm h-screen bg-background">
      <p className="font-medium text-lg text-primary">404 Error</p>
      <h2 className="md:text-6xl text-4xl font-semibold text-primary-foreground">
        Page Not Found
      </h2>
      <p className="text-base mt-4 text-muted-foreground">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <div className="flex items-center gap-4 mt-6">
        <Link
          to={"/login"}
          type="button"
          className="bg-primary px-7 py-2.5 text-white rounded active:scale-95 transition-all"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}

export default NoteFound;

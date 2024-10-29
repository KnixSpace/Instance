import Link from "next/link";

type Props = {};
const Dashboard = (props: Props) => {
  return (
    <>
      <section className="flex flex-col w-full divide-y divide-darkSecondary">
        <div className="flex items-center p-4 text-lg px-16">Workflows</div>
        <div className="w-full py-4 px-16">
          <div className="w-full grid grid-cols-3">
            {/* WIP make it dynamic with apis*/}
            <Link
              href={"/dashboard/workflow"}
              className="border border-lightbackground hover:border-secondary rounded-md p-4"
            >
              <div className="flex gap-4 items-center mb-2">
                <h1 className="text-base flex-1">Onboarding Wokrflow</h1>
                <span className="text-xs p-1 px-2 rounded-md bg-yellow-500/45">
                  Active
                </span>
              </div>
              <p className="text-sm text-secondary">
                its an automatic approach to onboarding the new employee
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
export default Dashboard;

import Link from 'next/link'

type Props = {}
const logs= (props: Props) => {
  return (
    <>
      <section className="flex flex-col w-full divide-y divide-darkSecondary">
        <div className="flex items-center p-4 text-lg px-16">Logs</div>
        <div className="py-4 px-16 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="w-full grid grid-cols-3">
            {/* WIP make it dynamic with apis*/}
            <Link
              href={'/dashboard/logs/log'}
              className="border border-lightbackground hover:border-secondary rounded-md p-4 mr-2"
            >
              <div className="flex gap-4 items-center mb-2">
                <h1 className="text-base flex-1">Wokrflow 1</h1>
                {/* <span className="text-xs p-1 px-2 rounded-md bg-yellow-500/45">
                  Active
                </span> */}
              </div>
              <p className="text-sm text-secondary">Click to check its logs</p>
            </Link>

            <Link
              href={'/dashboard/logs/log'}
              className="border border-lightbackground hover:border-secondary rounded-md p-4 mr-2"
            >
              <div className="flex gap-4 items-center mb-2">
                <h1 className="text-base flex-1">Wokrflow 2</h1>
                {/* <span className="text-xs p-1 px-2 rounded-md bg-yellow-500/45">
                  Active
                </span> */}
              </div>
              <p className="text-sm text-secondary">Click to check its logs</p>
            </Link>

          
          </div>
        </div>
      </section>
    </>
  )
}
export default logs;

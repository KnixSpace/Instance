import Link from 'next/link'

type Props = {}
const log= (props: Props) => {
  return (
    <>
      <section className="flex flex-col w-full divide-y divide-darkSecondary">
        <div className="flex items-center p-4 text-lg px-16">WorkFlow 1</div>
        <div className="py-4 px-16 flex-1 overflow-y-auto overflow-x-hidden"></div>
        
      </section>
    </>
)
}
export default log;

import Link from "next/link"

const links = [
    { name: '1-Sample Z Test', href: '/z1' },
    { name: '1-Sample T Test', href: '/t1' }
  ]
  
  export default function Home() {
    return (
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32 sm:p-100">
        <div
          className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[1920/1080] w-[100rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-40"
          />
        </div>
        <div
          className="absolute -top-100 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
          aria-hidden="true"
        >
          <div
            className="aspect-[1920/1080] w-[100rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-40"
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Welcome to the Stat Test Runner!</h2>
            <p className="mt-12 text-lg leading-8 text-gray-300">
              Click one of the following links and enter the relevant values to create a completed test PDF!
            </p>
          </div>
          <div className="mx-auto my-10 max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-24 gap-y-12 text-lg font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
              {links.map((link) => (
                <Link key={link.name} href={link.href}>
                  {link.name} <span aria-hidden="true">&rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
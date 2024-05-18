export default function ErrorBar({errorMsg} : {errorMsg:string}) {
    return (
        <span className = "font-lg font-red decoration-white-900">
            {errorMsg}
        </span>
    )
}
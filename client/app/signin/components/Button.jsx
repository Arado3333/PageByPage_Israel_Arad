

export default function Button(params)
{   
    return (
        <button type={"button" || params.type} className={params.className} onClick={params.onClick} tabIndex={params.tabIndex}></button>
    )

}

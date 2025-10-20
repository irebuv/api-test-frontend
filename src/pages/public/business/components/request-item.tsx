import React from 'react';
import {imageUrl} from "@/utils/imageUrl";
interface Order {
    id: string;
    name: string;
    is_read: boolean;
    phone: string;
    date: string;
    business_name: string;
    business_image: string;
    description: string;
}
export default function RequestItem({ el }: { el: Order }) {
    const [highlight, setHighlight] = React.useState(false);
    console.log(el.is_read)
    React.useEffect(() => {
        if (!el.is_read) {
            setHighlight(true);
            const timer = setTimeout(() => setHighlight(false), 10000);
            return () => clearTimeout(timer);
        }
    }, [el.is_read]);

    return (
        <div className={`${
            highlight ? 'animate-highlight' : ''
        }`}>
            <div className={`mt-3 flex justify-between gap-3 p-2 rounded`}>
                <div>
                    <p>
                        <b>{el.name}</b>
                    </p>
                    <p>{el.description}</p>
                </div>
                <div className={'w-[30%] text-right'}>
                    <span>{el.phone}</span>
                    <br />
                    <span>
                        <b>{el.date}</b>
                    </span>
                </div>
            </div>
            <div className='flex p-2 items-center gap-2'>
                <div>
                        <b>project: </b>{el.business_name}
                </div>
                {el.business_image && (
                    <img width='30' height='30' src={imageUrl(el.business_image)} alt={el.business_name} />
                )}
            </div>
            <hr />
        </div>
    );
}

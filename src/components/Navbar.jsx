import { navLinks, navIcons } from "#constants"
import useWindowStore from "#store/windows"
import dayjs from "dayjs"


const Navbar = () => {

    const {openWindow}=useWindowStore();
    return (
        <nav>
            <div>
                <img src="/images/logo.svg" alt="logo" />
                <p className='font-bold'>Zeeshan's Portfolio</p>

                <ul>
                    {navLinks.map(({ name, id ,type}) => (
                        <li key={id} onClick={()=>openWindow(type)}>
                            <p>{name}</p>
                        </li>
                    ))}
                </ul>
                
            </div>
            <div>
                <ul>
                    {navIcons.map(({ id, img }) => (
                        <li key={id}>
                            <img
                                className="icon-hover"
                                src={img}
                                alt={`icon-${id}`}
                            />
                        </li>
                    ))}
                </ul>
                <time>
                    {dayjs().format("ddd MMM D h:mm A")}
                </time>
            </div>
        </nav>
    )
}

export default Navbar
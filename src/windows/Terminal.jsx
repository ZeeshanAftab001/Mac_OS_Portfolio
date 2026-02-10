import WindowsControls from '#components/WindowsControls';
import { techStack } from '#constants';
import WindowWrapper from '#hoc/WindowWrapper'
import { Check, Flag } from 'lucide-react';
import React from 'react'

const Terminal = () => {
    return (
        <>
            <div id='window-header'>
                <WindowsControls target={"terminal"} />
                <h2>Tech Stack</h2>
            </div>

            <div className='techstack'>
                <p>
                    <span className='font-bold'>@zeeshan %</span>
                    show tech stack
                </p>
                <div className='label'>
                    <p className='w-32'>Category</p>
                    <p>Technologies</p>
                </div>
                <div>
                    <ul className='content'>
                        {techStack.map(({ category, items }) => (
                            <li key={category} className='flex items-center'>
                                <Check className='check' size={20} />
                                <h3>{category}</h3>
                                <ul>
                                    {items.map((item, index) => (  // Fixed: item and index, not {item, i}
                                        <li key={index}>
                                            {item} {index < items.length - 1 ? "," : ""}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='footnote'>
                    <p>
                            <Check size={20} />
                            5 of 5 stacks loaded successfully
                            (100%)
                    </p>
                    <p className='text-black'>
                        <Flag size={15} fill='black'/>
                        Render : 6ms
                    </p>
                </div>
            </div>


        </>
    );
};

const TerminalWindow = WindowWrapper({
    Component: Terminal, windowKey: "terminal"
});

export default TerminalWindow
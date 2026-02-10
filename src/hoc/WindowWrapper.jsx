import React, { useLayoutEffect, useRef } from 'react'
import { Draggable } from 'gsap/Draggable'
import useWindowStore from '#store/windows'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

function WindowWrapper({ Component, windowKey }) {
    const Wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore();
        const { isOpen, zIndex } = windows[windowKey];
        console.log(windows[windowKey]);
        const ref = useRef(null);

        useGSAP(() => {
            const el = ref.current;
            if (!el || !isOpen) return;
            el.style.display = "block";
            gsap.fromTo(el,
                {scale:0.8,opacity:0,y:40},
                {scale:1,opacity:1,y:0,duration:0.4,ease:"power3.out"}
            );
        }, [isOpen]);

        
        useGSAP(()=>{
            const el=ref.current;
            if(!el) return;
            const [instance]=Draggable.create(el,{
                onPress:()=>focusWindow(windowKey)
            })

            return ()=> instance.kill();
        })
        useLayoutEffect(() => {
            const el = ref.current;
            if (!el) return;
            el.style.display = isOpen ? "block" : "none";
        }, [isOpen])

        return <section id={windowKey} ref={ref}
            style={{ zIndex }} className='absolute'>
            <Component {...props} />
        </section>

    }
    const componentName = typeof Component === 'function'
        ? (Component.displayName || Component.name || "Component")
        : (typeof Component === 'string' ? Component : "Component");

    Wrapped.displayName = `windowWrapper(${componentName})`;
    return Wrapped;
}

export default WindowWrapper
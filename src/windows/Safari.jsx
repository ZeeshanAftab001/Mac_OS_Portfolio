import WindowsControls from '#components/WindowsControls'
import WindowWrapper from '#hoc/WindowWrapper'
import { blogPosts } from '#constants'
import { ChevronLeft, ChevronRight, Copy, PanelLeft, Search, Share, Plus, ShieldHalf, MoveRight } from 'lucide-react'
import React from 'react'

function Safari() {
    return (
        <>
            <div id='window-header'>
                <WindowsControls target="safari" />
                <PanelLeft className='ml-10 icon' />

                <div className='flex items-center gap-1 ml-5'>
                    <ChevronLeft className='icon' />
                    <ChevronRight className='icon' />
                </div>
                <div className='flex-1 flex-center gap-3'>
                    <ShieldHalf className='icon' />
                    <div className='search'>
                        <Search className='icon' />
                        <input type="text"
                            className='flex-1' placeholder='Search or enter website name' />
                    </div>
                </div>

                <div className='flex items-center gap-5'>
                    <Share className='icon' />
                    <Plus className='icon' />
                    <Copy className='icon' />
                </div>
            </div>
            <div className='blog'>
                <h2>My Developer Blogs</h2>

                <div className='space-y-8'>
                    {
                        blogPosts.map(({ id, image, data, link, title }) => (
                            <div id={id} className='blog-post'>
                                <div className='col-span-2'>
                                    <img src={image} alt={title} />
                                </div>
                                <div className='content'>
                                    <p>{data}</p>
                                    <h3>{title}</h3>
                                    <a href={link} target='_blank'
                                        rel='noopener noreferrer'>
                                        Check out the full post <MoveRight className='icon-hover' />
                                    </a>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

        </>
    )
}

const SafariWindow = WindowWrapper({
    Component: Safari,
    windowKey: "safari"
})

export default SafariWindow
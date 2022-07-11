import React from 'react'
import { useBoardContext } from '../../../context/BoardContext'
import NavbarContentPage from '../NavbarContentPage'
import LeftBarWorkspace from '../workspace_page/LeftBarWorkspace'
import LeftBarBoard from './LeftBarBoard'
import '../home_page/style/Home__css.css'

const BoardContent = () => {

    return (
        <div>
            <NavbarContentPage />
            <div className='homepage__content__container'>
                <LeftBarBoard />
                <div className="homePage__content__mid__container">
                    
                </div>
            </div>

        </div>
    )
}

export default BoardContent
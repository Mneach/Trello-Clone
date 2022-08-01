import NavbarContentPage from '../NavbarContentPage'
import LeftBarBoard from './LeftBarBoard'
import '../../../css/homeStyle/Home__css.css'
import { LeftBarContainer } from '../../../component/leftBar/LeftContainer'
import { GeneralContentContainer } from '../../../component/general/GeneralContainer'
import { MidContainer, MidContentContainer, MidListContainer, MidListContentContainer, MidListTitleContainer } from '../../../component/midContent/MidContainer'
import { FiSettings, FiActivity } from 'react-icons/fi'
import { IoNotificationsOutline } from 'react-icons/io5'
import { GoSignOut } from 'react-icons/go'
import React, { MouseEventHandler, useState } from 'react'
import { auth, db } from '../../../lib/firebase/config'
import { Link, useNavigate } from 'react-router-dom'
import '../../../css/navbarStyle/NavbarContentPage__css.css'
import { AiOutlinePlus, AiOutlineUser, AiTwotoneDelete } from 'react-icons/ai'
import { MidContentTitle } from '../../../component/midContent/MidContent'
import { addDoc, collection, doc, query, setDoc, where } from 'firebase/firestore'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { listType } from '../../../model/model'
import GetBoardContentData from '../../../lib/getData/GetBoardContentData'
import { useBoardContext } from '../../../context/BoardContext'

const BoardContent = () => {


    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const firestore = useFirestore()
    const BoardContext = useBoardContext()

    const getListCollection = collection(firestore, "ListCollection")
    const { status: statusGetDataList, data: dataList } = useFirestoreCollectionData(
        query(getListCollection, where("boardId", "==", BoardContext.board.boardId)
        ), {
        idField: 'listId'
    })

    const listData = dataList as Array<listType>

    if (statusGetDataList === 'loading') {
        return (<div>get data list...</div>)
    }

    const signOut: MouseEventHandler<HTMLButtonElement> = async (e) => {
        await auth.signOut()
        navigate('/')
    }


    const listFilterData = listData.filter((listData) => {
        if (search === "") return listData
        else return listData.listName.includes(search)
    })

    return (
        <div>
            <div className='homePage__navbar__container'>
                <div className="homePage__navbar__left">
                    <Link to={'/ContentPage/'} className="chello_ahref">
                        Chello
                    </Link>
                </div>
                <div className="homePage__navbar__mid">
                    <input className='homePage__search' onChange={(e) => setSearch(e.target.value)} placeholder='Search' type="text" />
                </div>
                <div className="homePage__navbar__right">
                    <div className="user__activity__icon">
                        <button className="button__icon">
                            <FiActivity />
                        </button>
                    </div>
                    <div className="user__notification__icon">
                        <Link to={'/ContentPage/UserNotification'} >
                            <button className="button__icon">
                                <IoNotificationsOutline />
                            </button>
                        </Link>
                    </div>
                    <div className="user__setting__icon">
                        <Link to={'/ContentPage/UserProfile'} >
                            <button className="button__icon">
                                <AiOutlineUser />
                            </button>
                        </Link>
                    </div>
                    <div className="user__signOut__icon">
                        <button className='button__icon' onClick={signOut}>
                            <GoSignOut />
                        </button>
                    </div>
                </div>
            </div>
            <GeneralContentContainer>
                <LeftBarContainer>
                    <LeftBarBoard />
                </LeftBarContainer>
                <MidContainer isDetailPage={true}>
                    {
                        Array.isArray(listFilterData) && !listFilterData.length ?
                            (
                                <MidContentContainer>
                                    <MidContentTitle titleName={"There is no list data"} data={false}></MidContentTitle>
                                </MidContentContainer>
                            )
                            :
                            (
                                <MidContentContainer>
                                    <MidContentTitle titleName={"List Data"} data={true}></MidContentTitle>
                                    <MidListContentContainer>
                                        {
                                            listFilterData.map((listData) => (
                                                <GetBoardContentData listData={listData} />
                                            ))
                                        }
                                    </MidListContentContainer>
                                </MidContentContainer>
                            )
                    }
                </MidContainer>
            </GeneralContentContainer>
        </div>
    )
}

export default BoardContent
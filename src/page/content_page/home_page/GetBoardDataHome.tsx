import React, { MouseEventHandler, useState } from 'react'
import { useUserContext } from '../../../context/UserContext'
import { addDoc, collection, doc, query, setDoc, where } from 'firebase/firestore'
import { useFirestore, useFirestoreCollection, useFirestoreCollectionData } from 'reactfire'
import { BoardType } from '../../../model/model'
import { union, uniq, uniqBy } from 'lodash'
import { Link } from 'react-router-dom'
import './style/Home__css.css'

const GetBoardDataHome = () => {

  const UserContext = useUserContext()
  const firestore = useFirestore()

  //=== Get Board From Firestore ===

  const getBoardCollection = collection(firestore, "BoardCollection")

  const getBoardByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberBoardOf/`)
  const { status: statusBoard, data: boards } = useFirestoreCollectionData(
    query(getBoardByUserId), {
    idField: 'boardId'
  })

  const { status: statusBoardPublic, data: boardPublicData } = useFirestoreCollectionData(
    query(getBoardCollection,
      where("boardVisibility", "==", "Public"),
    ), {
    idField: 'boardId'
  }
  )

  if (statusBoard === 'loading' || statusBoardPublic === 'loading') {
    return (<div>Getting Board Data....</div>)
  }

    const boardData = uniqBy(union((boards as Array<BoardType>), (boardPublicData as Array<BoardType>)), 'boardId')

  console.log(boardData)
  //=== End Of Get homePage From Firestore ===  

  if (Array.isArray(boardData) && !boardData.length) {
    return (
      <div className="homePage__content__mid">
        <div className="homePage__title">
          THERE IS NO BOARD DATA
        </div>
      </div>

    )
  } else {
    return (
      <div className="homePage__content__mid">
        <div className="homePage__title">
          BOARD DATA
        </div>
        <div className="homePage__content">
          {boardData.map((board) => (
            <Link to={''} className="link__homePage">
              <div className="homePage__boardCard">
                <div className="homePage__boardCard__title">
                </div>
                <div className="homePage__boardCard__content">
                  <p>{board.boardTitle} </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }
}

export default GetBoardDataHome 

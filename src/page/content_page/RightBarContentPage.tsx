import { useUserContext } from '../../context/UserContext'
import dummyPhoto from '../../lib/photo/dummy.png';
import { RightBarContentContainer, RightBarImageContainer, RightUserDataContainer } from '../../component/rightBar/RightContainer';
import { ImageUser } from '../../component/general/GeneralContent';

const RightBarContentPage = () => {

  const UserContext = useUserContext()
  return (
    <RightBarContentContainer>
      <RightBarImageContainer>
        {
          UserContext.user.imageLink ?
            (<ImageUser src={UserContext.user.imageLink} size={"70%"} borderRadiusSize={"10%"}></ImageUser>)
            :
            (<ImageUser src={dummyPhoto} size={"70%"} borderRadiusSize={"10%"}></ImageUser>)
        }
      </RightBarImageContainer>
      <RightUserDataContainer>
        <p>{UserContext.user.username}</p>
      </RightUserDataContainer>
      <RightUserDataContainer>
        <p>{UserContext.user.email}</p>
      </RightUserDataContainer>

    </RightBarContentContainer>
  )
}

export default RightBarContentPage
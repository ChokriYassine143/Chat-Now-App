import React from 'react'
import styled from 'styled-components'
import Robot from '../assets/robot.gif'

function Welcome({currentUser}) {
  return (
    <Container>
      <img src={Robot} alt="Robot" />
      <h1>
        Welcome, <span>{currentUser.username}</span>
      </h1>
      <h3>Please select a chat to start messaging</h3>
 
    </Container>
  )
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
color: white;
  padding: 2rem;
  img {
    max-width: 20rem;
  
  }
  span {
    color: #4e0eff;
  }
`
export default Welcome
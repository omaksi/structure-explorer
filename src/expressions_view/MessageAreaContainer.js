import React from 'react';
import styled from 'styled-components';

const MessageArea = styled.div`
  height: 85%;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column-reverse;
  margin-bottom: 2%;
  overflow: auto;
`;

const MessageAreaContainer = props => (
    <MessageArea>
        <div className={"d-inline-flex flex-column"}>
            {props.children}
        </div>
    </MessageArea>)

export default MessageAreaContainer;
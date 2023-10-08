import { useQuery, gql, useMutation, useSubscription } from '@apollo/client';
import { useEffect, useState } from 'react';

const GET_MESSAGES = gql`
  query {
    messages {
      id
      content
      user
    }
  }
`;

const ADD_MESSAGE = gql`
  mutation AddMessage($user: String!, $content: String!) {
    addMessage(user: $user, content: $content) {
      id
      user
      content
    }
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription {
    messages {
      id
      content
      user
    }
  }
`;

const Messages = ({ user }) => {
  const [dataFromCb, setDataFromCb] = useState({ messages: []});

  const { data, loading, error } = useQuery(GET_MESSAGES, { onCompleted: (res) => {
   setDataFromCb(res);
  } });


  const { subscriptionData, subscription_isloading, subscription_error } =
    useSubscription(MESSAGE_SUBSCRIPTION, {
      onSubscriptionData: (res) => {
        setDataFromCb(res.subscriptionData.data);
        console.log(res.subscriptionData.data);
      }
    });

  useEffect(() => {}, []);

  // Handle loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {dataFromCb.messages.map(({ id, content, user: messageUser }) => {
        return (
          <div
            key={id}
            style={{
              display: 'flex',
              justifyContent: user === messageUser ? 'flex-end' : 'flex-start',
              paddingBottom: '1em'
            }}
          >
            {user !== messageUser && (
              <div
                style={{
                  height: 50,
                  width: 50,
                  marginRight: '0.5em',
                  border: '2px solid #e5e6ea',
                  borderRadius: 25,
                  textAlign: 'center',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {messageUser.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div
              style={{
                background: user === messageUser ? '#58bf36' : '#e5e6ea',
                color: user === messageUser ? '#fff' : '#000',
                padding: '1em',
                borderRadius: '1em',
                maxWidth: '60%'
              }}
            >
              {content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Chat = () => {
  const [state, setState] = useState({
    user: 'Akanni',
    content: ''
  });

  const [addMessage, { data, loading, error }] = useMutation(ADD_MESSAGE);

  const handleSend = (evt) => {
    evt.preventDefault();
    if (state.content.length > 0) {
      addMessage({ variables: state });
    }
    state.content = '';
  };

  return (
    <div
      style={{
        width: '70%',
        margin: '0 auto'
      }}
    >
      <Messages user={state.user} />

      <form
        style={{
          display: 'flex',
          gap: '3rem',
          width: '100%'
        }}
      >
        <div
          style={{
            width: '30%'
          }}
        >
          <input
            style={{ width: '100%', padding: '0.5rem', borderRadius: '1rem' }}
            type='text'
            id='user'
            value={state.user}
            onChange={(evt) =>
              setState({
                ...state,
                user: evt.target.value
              })
            }
          />
        </div>
        <div
          style={{
            width: '100%'
          }}
        >
          <input
            style={{ width: '100%', padding: '0.5rem', borderRadius: '1rem' }}
            type='text'
            id='user'
            value={state.content}
            onChange={(evt) =>
              setState({
                ...state,
                content: evt.target.value
              })
            }
            onKeyUp={(evt) => {
              if (evt.keyCode === 13) handleSend(evt);
            }}
          />
        </div>
        <div style={{ width: '10rem' }}>
          <button
            style={{
              height: '100%',
              width: '100%',
              border: '2px solid grey',
              borderRadius: 10,
              textAlign: 'center',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={handleSend}
          >
            {' '}
            Send{' '}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;

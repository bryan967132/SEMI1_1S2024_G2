import { useState, useRef, useEffect } from 'react';
import styles from './Chat.module.scss';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

interface Message {
    id: number;
    text: any;
    sender: string;
}

const Chat: React.FC = () => {
    const { user } = useParams();

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }); // Desplazar hacia abajo suavemente
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages])

    const isDigit = (input: string): boolean => {
        return /^[0-9]+$/.test(input);
    }

    const handleMessageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
    
        var newId = messages.length + 1
    
        const newMessageObj: Message = {
            id: newId,
            text: isDigit(newMessage) ? parseInt(newMessage) : newMessage,
            sender: 'Me',
        };
    
        const updatedMessages = [...messages, newMessageObj]; // Crear una nueva matriz con el nuevo mensaje agregado
        setMessages(updatedMessages);
        setNewMessage('')
    
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sendMessage`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({mensaje: `${newMessage}`, usuario: `${user}`}),
            })
            if(response.ok) {
                const responseJSON = await response.json()
                console.log(responseJSON)

                newId ++

                const newMessages = responseJSON.messages.map((msg: any, index: number) => ({
                    id: newId + index,
                    text: msg.content,
                    sender: 'Bot'
                }));

                const updatedMessagesWithBotMessages = [...updatedMessages, ...newMessages];
                setMessages(updatedMessagesWithBotMessages);
            } else {
                const newMessages = [{
                    id: newId,
                    text: '¡No puedo ayudarte ahora!',
                    sender: 'Bot'
                }]

                const updatedMessagesWithBotMessages = [...updatedMessages, ...newMessages]; // Agregar los mensajes del bot a la matriz actualizada
                setMessages(updatedMessagesWithBotMessages);
            }
            scrollToBottom();
        } catch (error) {
            alert('Error al enviar mensaje')
        }
        scrollToBottom();
    };

    return (
        <div className={styles.chatglobal}>
            <div className="col-1 fixed-top d-flex justify-content-center m-5">
                <Link to={`/homeuserloggedin/${user}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#0d6efd" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                    </svg>
                </Link>
            </div>
            <div className={styles.chatContainer}>
                <div className={styles.messagesContainer}>
                    <div className={styles.welcome}>
                        <p style={{fontWeight: 'bold', fontSize: '120%'}}>Soy FaunaBot</p>
                        <p style={{fontSize: '100%'}}>¡Espero poder ayudarte con lo que necesites!</p>
                        <p style={{fontSize: '100%'}}>Estas son algunas cosas con las que puedo ayudarte:</p>
                        <p style={{fontSize: '100%'}}>1. Buscar cierta cantidad de fotos de un album específico.</p>
                        <p style={{fontSize: '100%'}}>2. Traducir la descripción de una foto.</p>
                        <p style={{fontSize: '100%'}}>3. Crear albums.</p>
                    </div>
                    {messages.map((message) => (
                        <div key={message.id} className={styles.message}>
                            <div className={message.sender === 'Me' ? styles.me : styles.bot}>
                                {!`${message.text}`.includes(`${import.meta.env.VITE_S3_URL}`) ?
                                    <div dangerouslySetInnerHTML={{ __html: `${message.text}`.replace(/\n/g, '<br/>') }}/>
                                    :
                                    <div className={message.text.split(';').length > 4 ? styles.cardimages3 : message.text.split(';').length == 4 ? styles.cardimages2 : styles.cardimages}>
                                        {message.text.split(';').map((image: string, index: number) => (
                                            <img key={index} src={image} alt="" className={styles['card-img-album']}/>
                                        ))}
                                    </div>
                                }
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef}/>
                </div>
                <form onSubmit={handleMessageSubmit} className={styles.inputForm}>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className={styles.messageInput}
                    />
                    <button type="submit" className={styles.sendButton}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
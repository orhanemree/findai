export interface ButtonProps {
    children?: any,
    onClick?: React.MouseEventHandler,
    disabled?: boolean,
    type?: "button" | "submit" | "reset"
}


export interface FormProps {
    children?: any,
    onSubmit?: React.FormEventHandler,
    novalidate?: boolean
}


export interface InputProps {
    onInput?: React.FormEventHandler,
    label?: any,
    required?: boolean,
}


export interface Message {
    userId: string,
    content: string,
    color: string,
    type: "prompt" | "answer"
}


export interface UserSchema {
    role: "admin" | "host" | "player" | "ai",
    userId: string,
    displayColor: string,
    ready: boolean,
    prompt: string,
    answer : string,
    votedFor: string
}


export interface RoomSchema {
    roomId: string,
    size: number,
    population: number,
    started: boolean,
    hostId: string,
    prompt: string,
    voting: boolean,
    users: Array<UserSchema>,
    gotMostVote: string, // uid of user
    playersWon: boolean
}


export interface UserResult {
    userId: string,
    votedFor: string,
    votes: number
}
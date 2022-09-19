import { NavigateFunction } from "react-router-dom";

export function handleDisconnect(navigate: NavigateFunction) {
    alert('Lost connection');
    localStorage.clear();
    navigate('/');
    window.location.reload();
};

export function handleLeave(navigate: NavigateFunction) {
    alert('called');
    localStorage.clear();
    navigate('/');
}
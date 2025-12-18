import React from 'react';

interface FlagIconProps {
  currency: string;
  className?: string;
}

const FlagIcon: React.FC<FlagIconProps> = ({ currency, className = 'w-6 h-4 rounded-sm' }) => {
  const flags: { [key: string]: React.ReactNode } = {
    BRL: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6"><path fill="#009639" d="M0 0h9v6H0z"/><path fill="#FEDF00" d="M4.5 1 1 3l3.5 2L8 3z"/><path fill="#002776" d="M4.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>,
    USD: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 12"><path fill="#b22234" d="M0 0h21v12H0z"/><path fill="#fff" d="M0 1h21v1H0zm0 2h21v1H0zm0 2h21v1H0zm0 2h21v1H0zm0 2h21v1H0zm0 2h21v1H0z"/><path fill="#3c3b6e" d="M0 0h9v6H0z"/></svg>,
    EUR: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6"><path fill="#039" d="M0 0h9v6H0z"/><circle cx="4.5" cy="3" r="2" fill="#FC0"/><path fill="none" stroke="#fff" strokeWidth=".2" d="m4.5 1.2.2.6h.6l-.5.4.2.6-.5-.3-.5.3.2-.6-.5-.4h.6z"/></svg>,
    GBP: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 6"><path fill="#00247d" d="M0 0h12v6H0z"/><path fill="#fff" d="m0 0 12 6M12 0 0 6"/><path fill="none" stroke="#cf142b" strokeWidth="1.2" d="m0 0 12 6M12 0 0 6"/><path fill="#fff" d="M5.4 0v6h1.2V0zm-5.4 2.4v1.2h12V2.4z"/><path fill="#cf142b" d="M6.6 0v6H5.4V0zM0 3.6v-1.2h12v1.2z"/></svg>,
    JPY: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6"><path fill="#fff" d="M0 0h9v6H0z"/><circle cx="4.5" cy="3" r="1.8" fill="#BC002D"/></svg>,
    CAD: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 6"><path fill="#d52b1e" d="M0 0h3v6H0zm9 0h3v6H9z"/><path fill="#fff" d="M3 0h6v6H3z"/><path fill="#d52b1e" d="M6 1.7 5 3.3h2L6 1.7zm.8 2.2L6 4.7l-.8-.8V5h1.6v-.9z"/></svg>,
    AUD: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 6"><path fill="#00247d" d="M0 0h12v6H0z"/><path fill="#fff" d="m0 0 6 3M6 0 0 3"/><path fill="none" stroke="#cf142b" strokeWidth=".6" d="m0 0 6 3M6 0 0 3"/><path fill="#fff" d="M2.7 0v3h.6V0zm-2.7 1.2v.6h6v-.6z"/><path fill="#cf142b" d="M3.3 0v3H2.7V0zM0 1.8v-.6h6v.6zM9.5 4.1.9 5.8l2-1.2 1.3 2 .2-2.3z"/></svg>,
  };

  const genericFlag = (
    <div className="w-full h-full bg-light-border dark:bg-dark-border flex items-center justify-center text-light-muted dark:text-dark-muted text-[8px] font-bold">
      {currency.slice(0, 2)}
    </div>
  );

  return <div className={className}>{flags[currency] || genericFlag}</div>;
};

export default FlagIcon;

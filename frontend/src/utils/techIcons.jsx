import React from 'react';

export const TECH_PRESETS = [
  { id: 'react', name: 'React', color: '#61DAFB' },
  { id: 'javascript', name: 'JavaScript', color: '#F7DF1E' },
  { id: 'typescript', name: 'TypeScript', color: '#3178C6' },
  { id: 'nodejs', name: 'Node.js', color: '#339933' },
  { id: 'express', name: 'Express', color: '#828282' },
  { id: 'mongodb', name: 'MongoDB', color: '#47A248' },
  { id: 'tailwind', name: 'Tailwind CSS', color: '#06B6D4' },
  { id: 'html5', name: 'HTML5', color: '#E34F26' },
  { id: 'css3', name: 'CSS3', color: '#1572B6' },
  { id: 'git', name: 'Git', color: '#F05032' },
  { id: 'aws', name: 'AWS', color: '#FF9900' }
];

export const getTechIcon = (id, size = 16) => {
  switch (id) {
    case 'react':
      return (
        <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
          <circle cx="0" cy="0" r="2.05" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );
    case 'javascript':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 0h24v24H0V0zm22.034 18.268c-.175-1.127-.899-2.028-2.308-2.613-1.423-.588-2.883-.933-2.883-1.956 0-.638.487-1.077 1.258-1.077.771 0 1.246.388 1.48 1.026.262-.68.804-1.192 1.488-1.505-.595-.916-1.543-1.429-2.956-1.429-2.012 0-3.344 1.218-3.344 3.096 0 2.877 3.824 2.507 3.824 4.024 0 .615-.558 1.05-1.424 1.05-1.053 0-1.637-.627-1.895-1.411-.318.599-.861 1.071-1.65 1.309.525.9 1.424 1.541 3.518 1.541 2.228 0 3.731-1.228 3.731-3.056h-.012zM8.351 9v2.542h1.782v8.91H8.351v-8.91H6.569V9h1.782z"/>
        </svg>
      );
    case 'typescript':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 0h24v24H0V0zm22.034 18.268c-.175-1.127-.899-2.028-2.308-2.613-1.423-.588-2.883-.933-2.883-1.956 0-.638.487-1.077 1.258-1.077.771 0 1.246.388 1.48 1.026.262-.68.804-1.192 1.488-1.505-.595-.916-1.543-1.429-2.956-1.429-2.012 0-3.344 1.218-3.344 3.096 0 2.877 3.824 2.507 3.824 4.024 0 .615-.558 1.05-1.424 1.05-1.053 0-1.637-.627-1.895-1.411-.318.599-.861 1.071-1.65 1.309.525.9 1.424 1.541 3.518 1.541 2.228 0 3.731-1.228 3.731-3.056h-.012zM8.351 9v2.542h1.782v8.91H8.351v-8.91H6.569V9h1.782z"/>
        </svg>
      );
    case 'nodejs':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7.7v11.5L12 25l10-5.8V7.7L12 2zm8 15.6l-8 4.6-8-4.6v-9.2l8-4.6 8 4.6v9.2zM12 8.5L7.5 11v5l4.5 2.5 4.5-2.5v-5L12 8.5zm2.5 6.6l-2.5 1.4-2.5-1.4v-2.8l2.5-1.4 2.5 1.4v2.8z"/>
        </svg>
      );
    case 'express':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12 12-5.373 12-12zm-3 1.5h-4.5c-.3 0-.5.2-.5.5v4.5c0 .3-.2.5-.5.5h-3c-.3 0-.5-.2-.5-.5V14c0-.3-.2-.5-.5-.5H7.5c-.3 0-.5-.2-.5-.5v-3c0-.3.2-.5.5-.5H12c.3 0 .5-.2.5-.5V5c0-.3.2-.5.5-.5h3c.3 0 .5.2.5.5v4.5c0 .3.2.5.5.5H21c.3 0 .5.2.5.5v3c0 .3-.2.5-.5.5z"/>
        </svg>
      );
    case 'mongodb':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-.3 0-5 4.5-5 9.5C7 15.5 10.5 21 12 24c1.5-3 5-8.5 5-14.5C17 4.5 12.3 0 12 0zm0 18c-2.2 0-4-3.1-4-6.5S9.8 5 12 5s4 3.1 4 6.5-1.8 6.5-4 6.5z"/>
        </svg>
      );
    case 'html5':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm17 5H5.5l.4 4.5h11.2l-.4 4.5-4.7 1.5-4.7-1.5-.3-3H4.5l.5 6.5 7 2.3 7-2.3 1-12.5z"/>
        </svg>
      );
    case 'css3':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm16.5 5H6l.4 4.5h9.2l-.4 4.5-3.2 1-3.2-1-.2-2H6.2l.3 4.5 5.5 1.8 5.5-1.8.8-9z"/>
        </svg>
      );
    case 'git':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.186 10.493L13.507.815a1.503 1.503 0 00-2.127 0L9.043 3.15l2.62 2.619a1.502 1.502 0 012.106 2.106l2.63 2.63a1.502 1.502 0 011.666 2.476 1.502 1.502 0 01-2.476-1.666l-2.618-2.619v4.542a1.502 1.502 0 01.378 2.378 1.502 1.502 0 01-2.378-.378v-4.542L8.351 9.072a1.502 1.502 0 01-2.106-2.106l-2.62-2.62L.815 12.026a1.502 1.502 0 000 2.127l9.678 9.679a1.503 1.503 0 002.127 0l9.679-9.679a1.502 1.502 0 000-2.127z"/>
        </svg>
      );
    case 'aws':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      );
    case 'tailwind':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19 12.001 19c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
        </svg>
      );
    default:
      return null;
  }
};

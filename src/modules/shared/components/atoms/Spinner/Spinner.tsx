import './Spinner.scss';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
  return (
    <div className={`spinner spinner--${size} ${className}`}>
      <div className="spinner__ring" />
    </div>
  );
};

export default Spinner;

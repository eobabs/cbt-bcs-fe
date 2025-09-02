import {Loader2} from 'lucide-react'

const LoadingSpinner = ({
                            size = 'medium',
                            text = '',
                            overlay = false,
                            className = ''
                        }) => {
    const sizes = {
        small: 16,
        medium: 24,
        large: 32,
        xlarge: 48
    }

    const spinnerSize = sizes[size] || sizes.medium

    const spinnerComponent = (
        <div className={`loading ${className}`} style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: size === 'small' ? '10px' : '20px'
        }}>
            <Loader2
                size={spinnerSize}
                style={{
                    animation: 'spin 1s linear infinite',
                    color: '#3b82f6',
                    marginBottom: text ? '12px' : '0'
                }}
            />
            {text && (
                <p style={{
                    margin: 0,
                    color: '#6b7280',
                    fontSize: size === 'small' ? '12px' : '14px',
                    textAlign: 'center'
                }}>
                    {text}
                </p>
            )}
        </div>
    )

    if (overlay) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {spinnerComponent}
            </div>
        )
    }

    return spinnerComponent
}

export const SkeletonCard = ({width = '100%', height = '200px'}) => (
    <div style={{
        width,
        height,
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden'
    }}>
        <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            animation: 'shimmer 1.5s infinite'
        }}/>
    </div>
)

export const SkeletonText = ({lines = 3, width = '100%'}) => (
    <div style={{width}}>
        {Array.from({length: lines}, (_, i) => (
            <div
                key={i}
                style={{
                    height: '16px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    marginBottom: i === lines - 1 ? '0' : '8px',
                    width: i === lines - 1 ? '70%' : '100%',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    animation: 'shimmer 1.5s infinite'
                }}/>
            </div>
        ))}
    </div>
)

export const QuizCardSkeleton = () => (
    <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div style={{flex: 1}}>
                <SkeletonText lines={1} width="60%"/>
                <div style={{marginTop: '12px'}}>
                    <SkeletonText lines={2} width="80%"/>
                </div>
                <div style={{marginTop: '16px', display: 'flex', gap: '16px'}}>
                    <SkeletonText lines={1} width="80px"/>
                    <SkeletonText lines={1} width="100px"/>
                </div>
            </div>
            <SkeletonCard width="80px" height="36px"/>
        </div>
    </div>
)

export const DashboardSkeleton = () => (
    <div>
        <div style={{marginBottom: '32px'}}>
            <SkeletonText lines={1} width="300px"/>
            <div style={{marginTop: '8px'}}>
                <SkeletonText lines={1} width="400px"/>
            </div>
        </div>
        <div className="grid grid-3" style={{marginBottom: '32px'}}>
            {Array.from({length: 3}, (_, i) => (
                <div key={i} className="card" style={{textAlign: 'center'}}>
                    <SkeletonCard width="32px" height="32px" style={{margin: '0 auto 12px'}}/>
                    <SkeletonText lines={1} width="60px" style={{margin: '0 auto 8px'}}/>
                    <SkeletonText lines={1} width="80px" style={{margin: '0 auto'}}/>
                </div>
            ))}
        </div>

        <div className="grid grid-2">
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <SkeletonText lines={1} width="150px" />
                    <SkeletonCard width="80px" height="36px" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Array.from({ length: 3 }, (_, i) => (
                        <QuizCardSkeleton key={i} />
                    ))}
                </div>
            </div>

            <div className="card">
                <SkeletonText lines={1} width="120px" style={{ marginBottom: '20px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Array.from({ length: 3 }, (_, i) => (
                        <SkeletonCard key={i} height="48px" />
                    ))}
                </div>
            </div>
        </div>
    </div>
)

export const ProgressBar = ({
                                value,
                                max = 100,
                                color = '#3b82f6',
                                height = '8px',
                                showLabel = false,
                                label = ''
                            }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    return (
        <div>
            {showLabel && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                    fontSize: '14px',
                    color: '#6b7280'
                }}>
                    <span>{label}</span>
                    <span>{Math.round(percentage)}%</span>
                </div>
            )}
            <div style={{
                width: '100%',
                height,
                backgroundColor: '#e5e7eb',
                borderRadius: height,
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: color,
                    borderRadius: height,
                    transition: 'width 0.3s ease-in-out'
                }} />
            </div>
        </div>
    )
}

export const LoadingButton = ({
                                  loading = false,
                                  children,
                                  loadingText = 'Loading...',
                                  ...props
                              }) => (
    <button
        {...props}
        disabled={loading || props.disabled}
        style={{
            ...props.style,
            position: 'relative',
            opacity: loading ? 0.7 : 1
        }}
    >
        {loading && (
            <Loader2
                size={16}
                style={{
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px'
                }}
            />
        )}
        {loading ? loadingText : children}
    </button>
)

export const LazyWrapper = ({ children, fallback = <LoadingSpinner /> }) => {
    return (
        <React.Suspense fallback={fallback}>
            {children}
        </React.Suspense>
    )
}

export const PageLoader = ({ message = 'Loading page...' }) => (
    <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <LoadingSpinner size="large" text={message} />
    </div>
)


export default LoadingSpinner
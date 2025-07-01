'use client';

type Props = {
    logoSize: number;
    fontSize: 'text-lg' | 'text-xl' | 'text-2xl';
    className?: string;
};

export default function MainLogo({ logoSize = 50, fontSize = 'text-2xl', className = '' }: Props) {
    return (
        <div>
            <div className={`flex items-center gap-2 ${className}`}>
                <svg aria-label='Main logo' width={logoSize} height={logoSize} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                    <g>
                        <path
                            fill='#1de9b6'
                            d='M383 37v170l50-43 50-42-50-43zM202 162l-19-80H29v80zM265 82l19 80h99V82zM129 190l-50 43-50 42 50 43 50 42V235zM176 315a120 120 0 0 1 48-61l-5-19h-90v80zM301 235l1 1a120 120 0 0 1 100 79h81v-80z'
                        />
                        <path
                            fill='#1de9b6'
                            d='M176 315h62l-14-61a120 120 0 0 0-48 61zM276 474l-38-159h-62a120 120 0 0 0-7 40 120 120 0 0 0 107 119zM321 315l33 141a120 120 0 0 0 55-101 120 120 0 0 0-7-40zM302 236l19 79h81a120 120 0 0 0-100-79Z'
                        />
                        <path
                            fill='#009688'
                            d='m219 235 5 19 14 61 38 159a120 120 0 0 0 13 1 120 120 0 0 0 65-19l-26-109a40 40 0 0 1 1 8 40 40 0 0 1-40 40 40 40 0 0 1-40-40 40 40 0 0 1 40-40 40 40 0 0 1 39 30l-7-30-19-79-1-1h-12zM265 82h-82l19 80h82z'
                        />
                    </g>
                </svg>
                <span className={`${fontSize} text-gray-600 font-bold font-sans select-none`}>128kVPN</span>
            </div>
        </div>
    );
}

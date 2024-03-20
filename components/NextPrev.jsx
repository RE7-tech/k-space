export default function NextPrev({
                                     onNext,
                                     onPrev,
                                     nextLabel = 'Suivant',
                                     prevLabel = 'Retour',
                                     disablePrev = false,
                                     disableNext = false,
                                     showPrev = true
                                 }) {
    return (
        <div className="fixed z-20 mt-8 inset-x-0 bottom-0 px-4 py-2 mx-auto md:relative md:bottom-auto md:mt-14 md:inset-x-0 w-full md:px-0 md:max-w-md">
            <div className="grid grid-cols-2 gap-4 w-full">
                {showPrev ? <button
                    disabled={disablePrev}
                    className={`border-2 active:shadow-none active:text-white active:border-0 hover:text-red-700 hover:border-red-700 hover:shadow-button-hover disabled:shadow-none active:bg-red-default  w-full text-lg font-bold text-red bg-white border-red border p-4 rounded-lg ${disablePrev ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                        if (!disablePrev && typeof onPrev === 'function') {
                            onPrev();
                        }
                    }}
                >
                    {prevLabel}
                </button> : <div className="w-full"></div>}

                <button
                    disabled={disableNext}
                    className={` border-0 hover:bg-red-700 hover:border-0 hover:shadow-button-hover disabled:bg-red-200 disabled:hover:shadow-none w-full text-lg font-bold bg-red text-white p-4 rounded-lg ${disableNext ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                        if (!disableNext && typeof onNext === 'function') {
                            onNext();
                        }
                    }}
                >
                    {nextLabel}
                </button>
            </div>
        </div>
    );
}

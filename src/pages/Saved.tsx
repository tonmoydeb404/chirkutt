import iconList from "../lib/iconList";

const Saved = () => {
    return (
        <>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Saved Posts</h3>

                <button className="btn btn-sm btn-theme">
                    remove all <span>{iconList.remove}</span>
                </button>
            </div>

            <div className="flex flex-col gap-3 mt-5"></div>
        </>
    );
};

export default Saved;

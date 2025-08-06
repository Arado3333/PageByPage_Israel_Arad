export default function DraftsLoader() {
    return (
        <div className="dm-draft-list animate-pulse">
            {[...Array(3)].map((_, idx) => (
                <div key={idx} className="dm-draft-card mb-4">
                    <div className="dm-card-header flex items-center justify-between mb-2">
                        <div className="dm-draft-title bg-gray-200 rounded w-32 h-6" />
                        <span className="dm-status-badge bg-gray-100 rounded w-16 h-5" />
                    </div>
                    <div className="dm-draft-snippet bg-gray-100 rounded w-full h-4 mb-2" />
                    <div className="dm-card-meta flex items-center gap-4 mb-2">
                        <span className="dm-book-tag bg-gray-200 rounded w-20 h-4" />
                        <div className="dm-meta-info flex gap-2">
                            <span className="dm-date bg-gray-100 rounded w-16 h-4" />
                        </div>
                    </div>
                    <div className="dm-card-actions flex gap-2 mt-2">
                        <span className="dm-action-btn dm-view-btn bg-gray-200 rounded w-12 h-8" />
                        <span className="dm-action-btn dm-edit-btn bg-gray-200 rounded w-12 h-8" />
                        <span className="dm-action-btn dm-delete-btn bg-gray-200 rounded w-12 h-8" />
                    </div>
                </div>
            ))}
        </div>
    );
}

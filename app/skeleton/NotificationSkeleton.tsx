export default function NotificationSkeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="h-16 bg-gray-200 rounded-xl"
                />
            ))}
        </div>
    );
}
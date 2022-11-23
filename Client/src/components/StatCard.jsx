import Skeleton from "./Skeleton";

const StatCard = (props) => {
  if (props.Amount && props.Name) {
    return (
      <div className="flex flex-col items-center w-80 h-80 bg-[#6D696A] rounded-lg group cursor-pointer ">
        <div className="duration-500 group-hover:blur-sm hover:!blur-none group-hover:scale-[0.85] hover:!scale-100">
        <div className="text-white font-semibold p-2 group-hover:blur-sm">{props.Name}</div>
        <div className="mt-20 text-white text-4xl font-bold group-hover:blur-sm">
          {props.Amount}
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-80 h-80 bg-[#6D696A] rounded-lg">
      <Skeleton />
    </div>
  );
};

export default StatCard;

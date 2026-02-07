// export const getCourseAccessStatus = (user: any, courseId: string) => {
//   // 1. Not Logged In
//   if (!user) return { isLocked: true, reason: "LOGIN_REQUIRED" };

//   // 2. Admin access
//   if (user.role === "admin") return { isLocked: false, reason: "ADMIN" };

//   // 3. User is Pro -> Check specific course list
//   if (user.courseplan === "pro") {
//     const hasCourse = user.courses?.some((c: any) => c.courseId === courseId && c.status === "active");
//     return hasCourse 
//       ? { isLocked: false, reason: "PURCHASED" } 
//       : { isLocked: true, reason: "NOT_PURCHASED" };
//   }

//   // 4. Default: Free user
//   return { isLocked: true, reason: "UPGRADE_REQUIRED" };
// };

export const checkAccess = (user: any, courseId: string) => {
  if (!user) return "LOCKED_LOGIN"; 
  if (user.role === "admin") return "OPEN"; 

  if (user.courseplan === "pro") {
    const hasCourse = user.courses?.some((c: any) => c.courseId === courseId);
    return hasCourse ? "OPEN" : "LOCKED_BUY";
  }

  return "LOCKED_UPGRADE"; 
};
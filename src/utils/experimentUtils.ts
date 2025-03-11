import { Answer, Condition } from "@/types/Experiment";
import type { Word } from "@/types/Experiment";
import { GroupType } from "@/types/Experiment";

/**
 * 判断用户响应是否正确
 * @param userResponse 用户的按键响应 ('f' 或 'j')
 * @param stimulus 当前刺激项
 * @param group 用户所属组别 (A 或 B)
 * @returns 是否正确
 */
export function checkResponseCorrectness(
  userResponse: string,
  stimulus: Word | null,
  group: GroupType = GroupType.A
): boolean {
  if (!stimulus) return false;

  const normalizedResponse = userResponse.toLowerCase();

  // 根据 condition 和 group 决定正确的按键
  let expectedResponse: string;

  if (group === GroupType.A) {
    // A 组: SR 刺激下按 J 键，其余按 F 键
    expectedResponse = stimulus.condition === Condition.SR ? "j" : "f";
  } else {
    // B 组: SR 刺激下按 F 键，其余按 J 键
    expectedResponse = stimulus.condition === Condition.SR ? "f" : "j";
  }

  return normalizedResponse === expectedResponse;
}

/**
 * 计算响应时间
 * @param endTime 结束时间
 * @param startTime 开始时间
 * @returns 响应时间（毫秒）
 */
export function calculateResponseTime(
  endTime: number,
  startTime: number
): number {
  return endTime - startTime;
}

/**
 * 格式化响应时间显示
 * @param responseTime 响应时间（毫秒）
 * @returns 格式化后的响应时间
 */
export function formatResponseTime(responseTime: number): string {
  return `${Math.round(responseTime)}ms`;
}

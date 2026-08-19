# 频率响应与幅角原理：概念记录

## 第一阶段第一讲：频率、角频率和周期

一个正弦信号可以写成：

$$
x(t)=X\cos(\omega t+\varphi)
$$

频率 $f$ 表示一秒完成多少个周期，单位为 $\mathrm{Hz}$；周期 $T_0$ 表示完成一个周期需要多少秒。因此：

$$
T_0=\frac{1}{f}
$$

正弦函数内部使用角度描述进度。一个完整周期对应一整圈，即 $2\pi$ 弧度。如果每秒完成 $f$ 圈，那么每秒走过的角度为：

$$
\omega=2\pi f
$$

所以：

$$
T_0=\frac{1}{f}=\frac{2\pi}{\omega}
$$

代入 $f=50\text{ Hz}$：

| 量 | 计算 | 结果 |
| --- | --- | --- |
| 周期 | $T_0=1/f$ | $0.02\text{ s}=20\text{ ms}$ |
| 角频率 | $\omega=2\pi f$ | $100\pi\text{ rad/s}$ |
| 一个周期走过的角度 | $\omega T_0$ | $2\pi\text{ rad}$ |

一句话结论：$f$ 按“圈数”记录振荡速度，$\omega$ 按“弧度数”记录同一个振荡速度，$T_0$ 记录走完一圈所需的时间。

## 第一阶段第二讲：频率响应为什么是 $H(j\omega)$

线性时不变系统的冲激响应为 $h(t)$，输入复指数信号：

$$
x(t)=e^{j\omega t}
$$

输出为卷积：

$$
\begin{aligned}
y(t)
&=\int_{-\infty}^{\infty}h(\tau)x(t-\tau)\,\mathrm d\tau \\
&=\int_{-\infty}^{\infty}h(\tau)e^{j\omega(t-\tau)}\,\mathrm d\tau \\
&=e^{j\omega t}\int_{-\infty}^{\infty}h(\tau)e^{-j\omega\tau}\,\mathrm d\tau
\end{aligned}
$$

定义：

$$
H(j\omega)=\int_{-\infty}^{\infty}h(\tau)e^{-j\omega\tau}\,\mathrm d\tau
$$

因此：

$$
y(t)=H(j\omega)e^{j\omega t}
$$

对一个固定的 $\omega$，$H(j\omega)$ 不随时间改变，只会改变输入的幅度和相位；输出的时间项仍为 $e^{j\omega t}$，所以频率没有改变。

若：

$$
H(j\omega)=|H(j\omega)|e^{j\varphi}
$$

则实信号的稳态输出为：

$$
y(t)=|H(j\omega)|\cos(\omega t+\varphi)
$$

一句话结论：复指数是线性时不变系统的特征函数；经过系统后函数形式不变，只多乘一个复数 $H(j\omega)$。

## 第一阶段第三讲：从 $H(s)$ 到 $H(j\omega)$

拉普拉斯分析使用一般形式：

$$
e^{st},\qquad s=\sigma+j\omega
$$

展开可得：

$$
e^{st}=e^{\sigma t}e^{j\omega t}
$$

其中 $\sigma$ 控制包络随时间增长或衰减，$\omega$ 控制旋转速度。频率响应考察的是等幅正弦稳态，因此令 $\sigma=0$：

$$
s=j\omega
$$

于是完整传递函数在虚轴上的取值就是频率响应：

$$
H(j\omega)=H(s)\big|_{s=j\omega}
$$

例如：

$$
H(s)=\frac{1}{1+sRC}
$$

代入 $s=j\omega$：

$$
H(j\omega)=\frac{1}{1+j\omega RC}
$$

一句话结论：$H(s)$ 描述所有形如 $e^{st}$ 的模式，$H(j\omega)$ 只取其中不会自行增长或衰减的正弦模式。

## 第二阶段第一讲：从复数频率响应拆出幅度和相位

RC 低通的频率响应为：

$$
H(j\omega)=\frac{1}{1+j\omega RC}
$$

令 $x=\omega RC$，则：

$$
H(j\omega)=\frac{1}{1+jx}
$$

分母 $1+jx$ 在复平面上的实部为 1、虚部为 $x$，所以其模长为：

$$
|1+jx|=\sqrt{1+x^2}
$$

分母的相角为：

$$
\arg(1+jx)=\arctan(x)
$$

倒数的模长取倒数，相角取反，因此：

$$
|H(j\omega)|=\frac{1}{\sqrt{1+(\omega RC)^2}}
$$

$$
\angle H(j\omega)=-\arctan(\omega RC)
$$

一句话结论：求频率响应的幅度和相位，本质上就是把复数写成极坐标形式；复数位于分母时，模长取倒数，相角取负。

## 已确认理解：为什么定义为输出与输入之比

用户表述：频率响应想刻画信号经过系统后发生的变化，因此使用输出与输入的比值描述这个系统。

补充两个限定：

1. 比较的是同一角频率 $\omega$ 下的复数幅值：

$$
H(j\omega)=\frac{\underline V_{\mathrm{out}}}{\underline V_{\mathrm{in}}}
$$

2. 在线性系统中，输入整体放大 $k$ 倍，输出也放大 $k$ 倍，因此比值不变：

$$
\frac{k\underline V_{\mathrm{out}}}{k\underline V_{\mathrm{in}}}
=\frac{\underline V_{\mathrm{out}}}{\underline V_{\mathrm{in}}}
$$

所以这个比值描述的是系统在频率 $\omega$ 下的作用，而不是某一次输入和输出的绝对大小。

## 单位：$RC$、极点频率和极点位置

电阻和电容使用 SI 单位时：

$$
R[\Omega]\cdot C[\mathrm F]=RC[\mathrm s]
$$

因此：

$$
\omega_0=\frac{1}{RC}
$$

单位为 $\mathrm{rad/s}$；极点位置：

$$
p=-\frac{1}{RC}
$$

属于复频率 $s$，单位为 $\mathrm{s^{-1}}$。角频率的弧度是无量纲的，所以数值单位有时也会写成 $\mathrm{s^{-1}}$，但为了区分物理含义，$\omega$ 通常写 $\mathrm{rad/s}$。

例：$R=2\mathrm{k}\Omega=2000\Omega$，$C=0.5\mu\mathrm F=0.5\times10^{-6}\mathrm F$：

$$
RC=2000\times0.5\times10^{-6}=10^{-3}\mathrm s
$$

$$
\omega_0=1000\mathrm{rad/s},\qquad p=-1000\mathrm{s^{-1}}
$$

## 从频率响应扩展到传递函数

$H(j\omega)$ 只考察等幅正弦模式 $e^{j\omega t}$，因此适合回答外部正弦输入经过电路后发生的幅度和相位变化。

稳定性关心的是撤掉外部输入后，电路中的扰动会衰减还是增长。为此需要把等幅正弦模式扩展为：

$$
e^{st}=e^{\sigma t}e^{j\omega t},\qquad s=\sigma+j\omega
$$

其中 $\sigma$ 描述幅度的增长或衰减，$\omega$ 描述振荡。对 $e^{st}$ 求导：

$$
\frac{\mathrm d}{\mathrm dt}e^{st}=se^{st}
$$

所以在 RC 电路方程中，把求导换成乘以 $s$，得到：

$$
H(s)=\frac{1}{1+sRC}
$$

令 $\sigma=0$，即 $s=j\omega$，便回到频率响应：

$$
H(j\omega)=H(s)\big|_{s=j\omega}
$$

一句话结论：$H(j\omega)$ 是 $H(s)$ 在虚轴上的取值；前者描述正弦稳态，后者还能描述增长和衰减，因此稳定性分析需要 $H(s)$。

## 幅角原理为什么能数零点和极点

> **当前状态：旧预览，尚未掌握。** 这一节曾在“待检查区域、闭合边界 $\Gamma$、映射平面、外部零点和极点贡献”等桥梁建立之前提前写入。当前不要把下面的总公式当作已经会推导的内容；真实进度与重学顺序见 `05-summary.md`。

先取只含一个零点的函数：

$$
F(s)=s-z_0
$$

当 $s$ 沿逆时针闭合路径 $\Gamma$ 走一圈时，$F(s)$ 就是从零点 $z_0$ 指向当前 $s$ 的向量。如果 $z_0$ 在路径内部，该向量方向累计增加 $360^\circ$；如果 $z_0$ 在路径外部，方向只来回摆动，累计变化为 0。

一个内部零点因此贡献：

$$
\Delta\arg(s-z_0)=+360^\circ
$$

对于一个极点：

$$
F(s)=\frac{1}{s-p_0}
$$

倒数使相角取负，因此一个内部极点贡献：

$$
\Delta\arg\frac{1}{s-p_0}=-360^\circ
$$

一般有理函数为：

$$
F(s)=K\frac{\prod_i(s-z_i)}{\prod_k(s-p_k)}
$$

复数相乘时相角相加、相除时相角相减，所以路径走完一圈后的总相角变化为：

$$
\Delta_\Gamma\arg F(s)=360^\circ(Z-P)
$$

若用 $N$ 表示映射轨迹逆时针绕原点的净圈数：

$$
N=Z-P
$$

这里 $Z$、$P$ 只计算闭合路径内部的零点和极点，并按重数计算。路径不能穿过零点或极点。

一句话结论：闭合路径内的每个零点让映射轨迹多绕原点一圈，每个极点抵消一圈，因此数映射轨迹的净绕圈数就得到 $Z-P$。

## Nyquist 图的第一个含义：把频率响应复数直接画成点

本例有源 RC 的频率响应为：

$$
H(j\omega)=\frac{4}{1+j\omega RC}
$$

令归一化频率：

$$
x=\omega RC=\frac{\omega}{\omega_p}
$$

为了得到复平面坐标，将分母实数化：

$$
\begin{aligned}
H(j\omega)
&=\frac{4}{1+jx}\\
&=\frac{4(1-jx)}{(1+jx)(1-jx)}\\
&=\frac{4(1-jx)}{1+x^2}\\
&=\frac{4}{1+x^2}-j\frac{4x}{1+x^2}
\end{aligned}
$$

因此 Nyquist 图中每一个频率点的坐标为：

$$
\operatorname{Re}H=\frac{4}{1+x^2},\qquad
\operatorname{Im}H=-\frac{4x}{1+x^2}
$$

代入几个频率：

| $x=\omega/\omega_p$ | $H(j\omega)$ | 复平面坐标 |
| ---: | ---: | ---: |
| $0$ | $4$ | $(4,0)$ |
| $0.1$ | $3.960-j0.396$ | $(3.960,-0.396)$ |
| $1$ | $2-j2$ | $(2,-2)$ |
| $10$ | $0.0396-j0.396$ | $(0.0396,-0.396)$ |
| $\to\infty$ | $\to0$ | $(0,0)$ |

从原点指向这个复数点的向量，其长度就是 $|H(j\omega)|$，方向角就是 $\angle H(j\omega)$。因此 Bode 图和 Nyquist 图使用的是同一组 $H(j\omega)$：前者把长度和角度拆开画，后者把复数点直接画在复平面上。

一句话结论：Nyquist 图不是另一种新的响应，而是把扫频得到的每一个复数 $H(j\omega)$ 按实部和虚部坐标画出来，再按频率顺序连接起来。

## 有源与无源：看能量从哪里来

区分有源与无源，核心不是看某处电压有没有升高，也不是看输出是否稳定，而是看它能否从其他形式的能量来源向电路提供净能量。

### 1. 无源元件的能量账本

无源元件只能消耗能量，或者暂时储存电路先前交给它的能量，再把不超过这部分的能量还回来。

以电阻为例。一个 $1\,\mathrm{k}\Omega$ 电阻两端加 $2\,\mathrm V$：

$$
I=\frac{V}{R}=\frac{2}{1000}=2\,\mathrm{mA}
$$

它吸收的功率为：

$$
P=VI=2\times2\,\mathrm{mA}=4\,\mathrm{mW}
$$

这部分电能最终变成热，电阻不会生成新的电能。

再看一个 $10\,\mu\mathrm F$、充到 $2\,\mathrm V$ 的电容。它储存的能量为：

$$
\begin{aligned}
E_C
&=\frac12CV^2\\
&=\frac12\times10\times10^{-6}\times2^2\\
&=20\,\mu\mathrm J
\end{aligned}
$$

电容放电时虽然能够向外送能量，但它最多只是返还先前充入的 $20\,\mu\mathrm J$。理想情况下：

$$
E_{\text{返还}}\leq E_{\text{先前充入}}
$$

所以“能够短暂放出能量”不能证明它是有源器件。

### 2. 有源部分的能量账本

电池、发电机或电源适配器能够把其他形式的能量转化成电能送入电路：

| 对象 | 提供的电能来自哪里 |
| --- | --- |
| 电池 | 化学能 |
| 发电机 | 机械能 |
| 电源适配器 | 电网提供的能量 |
| 已充电电容 | 先前由电路充入的电能，只能返还 |

输出是否稳定不是判断标准。例如手摇发电机的输出电压可以不断波动，但它仍在把人做的机械功转化成电能，因此仍是能量源。真实电池也会耗尽；“能够提供净能量”并不是“永远不会耗尽”，而是存在一个不同于当前信号输入的能量来源。

一句话结论：能从其他能量来源向电路提供净能量就是有源；只能消耗、储存并返还先前从电路得到的能量就是无源。

## 真实放大器中信号与电源的分工

真实放大器必须有供电端。输入信号和电源承担不同任务：输入小信号决定输出怎样变化，电源提供驱动负载所需的主要能量；放大器内部电路根据输入信号，调节从电源流向负载的能量。

```text
                         +12 V 供电
                            │
                            │ 提供能量
                            ▼
0.1 V 小信号 ───────▶ ┌──────────┐
   决定输出怎么变化     │  放大器   │ ─────▶ 1 V 输出 ──▶ 负载
                      └──────────┘
                            ▲
                            │
                         -12 V 供电
```

### 1. 输入端的功率

为了单独核对能量来源，暂时使用直流数值。假设输入电压为 $0.1\,\mathrm V$，放大器输入端等效电阻为 $100\,\mathrm{k}\Omega$：

$$
I_{\mathrm{in}}
=\frac{V_{\mathrm{in}}}{R_{\mathrm{in}}}
=\frac{0.1}{100\,000}
=1\,\mu\mathrm A
$$

输入信号提供的功率为：

$$
P_{\mathrm{in}}
=V_{\mathrm{in}}I_{\mathrm{in}}
=0.1\times1\,\mu\mathrm A
=0.1\,\mu\mathrm W
$$

### 2. 输出端的功率

假设放大器向 $100\,\Omega$ 负载输出 $1\,\mathrm V$：

$$
I_{\mathrm{out}}
=\frac{V_{\mathrm{out}}}{R_L}
=\frac{1}{100}
=10\,\mathrm{mA}
$$

负载得到的功率为：

$$
P_{\mathrm{out}}
=V_{\mathrm{out}}I_{\mathrm{out}}
=1\times10\,\mathrm{mA}
=10\,\mathrm{mW}
=10\,000\,\mu\mathrm W
$$

输入端只有 $0.1\,\mu\mathrm W$，负载却得到 $10\,000\,\mu\mathrm W$，因此输出功率不可能全部来自输入信号。完整的能量账本是：

$$
P_{\mathrm{电源}}+P_{\mathrm{输入}}
=P_{\mathrm{负载}}+P_{\mathrm{内部损耗}}
$$

输入信号仍可能携带少量能量，但它的主要作用是控制输出怎样变化；输出所需的主要能量来自独立供电。拔掉正、负电源后，放大器内部失去工作条件，不能继续维持 $1\,\mathrm V$、$10\,\mathrm{mA}$ 的输出。

一句话结论：小输入信号负责控制输出的变化规律，独立电源负责提供主要输出能量；放大不会违反能量守恒。

## 为什么真实放大器可以抽象成受控源

真实放大器包含供电端、输入端、输出端以及大量内部元件。分析有源 RC 时，关心的是输入改变后输出怎样改变，而不是每个内部晶体管的工作细节，因此可以用只保留外部控制规律的行为模型代替真实器件。

受控源是一种理想电路模型：它的输出电压或电流由电路中的另一个电压或电流决定。

```text
物理现实：

输入负责控制 ──▶ 内部电路调节电源能量 ──▶ 输出


简化模型：

输入负责控制 ───────────────────────▶ 输出
                  ↑
          供电和内部过程被省略
```

### 1. 省略供电端的前提

供电端没有画出，不代表供电在物理上不存在，更不代表输出能量改由输入信号提供。模型默认：

1. 真实器件已经正确接上独立电源；
2. 供电在当前信号分析中保持不变；
3. 输出尚未碰到供电电压、电流和功率极限。

因此，模型只显式保留输入与输出之间的控制关系；输出能量仍来自被省略的供电。

### 2. 控制关系不是能量通路

受控源的控制端和输出端不需要在模型中用普通导线连接，因为二者表达的是控制关系，不是同一条电流通路。类似水龙头的手柄控制出水量，但水并不是从手柄流入水管：

```text
手柄 ──控制关系──▶ 出水量
水管 ──能量通路──▶ 水流
```

真实器件内部存在连接输入、输出和供电的晶体管网络；受控源用数学控制关系代替了这些内部细节。

### 3. 理想模型的适用范围

假设某放大器正常工作时，输入与输出有如下关系：

| 输入电压 | 模型预测的输出电压 | 接 $\pm12\,\mathrm V$ 电源的真实放大器 |
| ---: | ---: | ---: |
| $0.1\,\mathrm V$ | $1\,\mathrm V$ | 通常可以做到 |
| $0.8\,\mathrm V$ | $8\,\mathrm V$ | 通常可以做到 |
| $2\,\mathrm V$ | $20\,\mathrm V$ | 超出供电范围，会失真或削顶 |

理想受控源可以继续给出 $20\,\mathrm V$，因为模型暂时忽略供电限制；真实放大器不能。因此模型只在真实器件的正常工作范围内代表其主要行为。

一句话结论：把真实放大器画成受控源，是在供电稳定存在且器件未碰到极限的前提下，省略内部能量调节过程，只保留输入如何控制输出的规律。

## VCVS：电压控制电压源

VCVS（Voltage-Controlled Voltage Source）读取一组控制端子之间的电压，并按照固定比例在另一组输出端子之间建立电压。控制端负责决定输出，真实器件中被模型省略的独立供电负责输出能量。

设控制端参考电压和输出端参考电压分别为：

$$
v_x=v_A-v_B,
\qquad
v_o=v_C-v_D
$$

VCVS 的控制关系为：

$$
v_o=\mu v_x
$$

其中 $\mu$ 是电压增益。因为：

$$
\mu=\frac{v_o}{v_x}
$$

所以它的单位为 $\mathrm V/\mathrm V=1$，即没有物理单位。

### 1. 数值与符号

本例取 $\mu=4$：

| $v_x$ | $v_o=4v_x$ | 输出实际极性相对输出参考方向 |
| ---: | ---: | --- |
| $0$ | $0$ | 无正负之分 |
| $0.5\,\mathrm V$ | $2\,\mathrm V$ | 相同 |
| $-0.25\,\mathrm V$ | $-1\,\mathrm V$ | 相反 |
| $-0.5\,\mathrm V$ | $-2\,\mathrm V$ | 相反 |

特别地，当 $v_x=-0.25\,\mathrm V$ 时：

$$
v_o=4\times(-0.25)=-1\,\mathrm V
$$

因为 $v_o=v_C-v_D$，所以：

$$
v_C-v_D=-1\,\mathrm V
$$

因此：

$$
v_D=v_C+1\,\mathrm V
$$

即实际输出极性与输出端预先标出的正方向相反。不过 $v_x$ 和 $v_o$ 都是负数，因此二者互相比较时仍然同号；这是因为 $\mu>0$。必须区分“输入输出是否同号”和“输出实际极性是否符合输出参考方向”这两个问题。

### 2. 输出功率的来源

当 $v_x=0.5\,\mathrm V$ 时：

$$
v_o=4\times0.5=2\,\mathrm V
$$

若输出接 $1\,\mathrm{k}\Omega$ 负载：

$$
i_o=\frac{v_o}{R_L}=\frac{2}{1000}=2\,\mathrm{mA}
$$

$$
P_L=v_oi_o=2\times2\,\mathrm{mA}=4\,\mathrm{mW}
$$

这 $4\,\mathrm{mW}$ 不从控制端流到输出端。对于 VCVS 所代表的真实放大器，负载能量来自被模型省略的独立电源。受控源模型只保留 $v_x$ 如何决定 $v_o$ 的规律，本身不是物理能量来源。

理想 VCVS 的控制端只读取电压而不吸取电流：

$$
i_x=0
$$

因此其理想输入电阻为：

$$
R_{\mathrm{in}}=\frac{v_x}{i_x}\to\infty
$$

### 3. VCVS 在有源 RC 中代表什么

若输入信号源直接连接 RC，则电路只是无源 RC，不需要 VCVS。这里的有源 RC 在输入信号源和 RC 之间增加了一只由独立直流电源供能的真实放大器；VCVS 只替代这只放大器的输入输出行为：

$$
v_i\longrightarrow \text{放大器}\longrightarrow v_s\longrightarrow RC\longrightarrow v_o
$$

模型中：

$$
v_s=\mu v_i
$$

例如：

$$
v_i(t)=0.5\sin(\omega t)\,\mathrm V,
\qquad \mu=4
$$

则放大器输出为：

$$
\begin{aligned}
v_s(t)
&=\mu v_i(t)\\
&=4\times0.5\sin(\omega t)\\
&=2\sin(\omega t)\,\mathrm V
\end{aligned}
$$

因此 RC 左端收到的是 $v_s(t)=2\sin(\omega t)\,\mathrm V$，不是原输入 $v_i(t)=0.5\sin(\omega t)\,\mathrm V$。输入信号源产生 $v_i$；VCVS 代表放大器；真实放大器的独立供电提供输出能量；$v_s$ 是放大器交给 RC 的输出。

一句话结论：VCVS 按照 $v_o=\mu v_x$ 用控制电压决定输出电压；$\mu>0$ 表示输入输出同号，而输出数值为负表示其实际极性与输出参考方向相反；真实输出能量来自独立供电。

## VCCS：电压控制电流源

VCCS（Voltage-Controlled Current Source）读取控制端电压 $v_x$，并按照固定比例在输出端建立电流 $i_o$：

$$
i_o=g_mv_x
$$

其中 $g_m$ 叫作跨导，表示控制电压每变化 $1\,\mathrm V$，输出电流变化多少。因为：

$$
g_m=\frac{i_o}{v_x}
$$

所以其单位为：

$$
\frac{\mathrm A}{\mathrm V}=\mathrm S
$$

$\mathrm S$ 叫西门子。VCCS 常用来描述“输入电压控制输出电流”的真实有源器件行为，例如晶体管的小信号行为；真实输出能量仍由模型背后的独立电源提供。

### 1. 从控制电压得到输出电流

假设：

$$
g_m=5\,\mathrm{mS}=0.005\,\mathrm{\frac A V}
$$

当：

$$
v_x=0.2\,\mathrm V
$$

输出电流为：

$$
\begin{aligned}
i_o
&=g_mv_x\\
&=0.005\times0.2\\
&=0.001\,\mathrm A\\
&=1\,\mathrm{mA}
\end{aligned}
$$

若控制电压为负：

$$
v_x=-0.1\,\mathrm V
$$

则：

$$
\begin{aligned}
i_o
&=0.005\times(-0.1)\\
&=-0.0005\,\mathrm A\\
&=-0.5\,\mathrm{mA}
\end{aligned}
$$

负号表示实际电流大小为 $0.5\,\mathrm{mA}$，方向与预先标出的输出参考箭头相反。

### 2. 负载决定输出电压

VCCS 直接规定输出电流，输出电压还取决于外接负载。若 $i_o=1\,\mathrm{mA}$ 流过 $1\,\mathrm{k}\Omega$ 电阻：

$$
v_o=i_oR
=1\,\mathrm{mA}\times1\,\mathrm{k}\Omega
=1\,\mathrm V
$$

因此 VCVS 与 VCCS 的关键区别是：VCVS 直接建立输出电压，由负载决定所需电流；VCCS 直接建立输出电流，由负载决定形成的电压。

一句话结论：VCCS 按照 $i_o=g_mv_x$ 把控制电压转换成输出电流；电流负号表示实际方向与参考箭头相反，负载再决定输出电压，真实能量来自独立供电。

## CCVS：电流控制电压源

CCVS（Current-Controlled Voltage Source）读取控制支路中的电流 $i_x$，并按照固定比例在另一组输出端子上建立电压 $v_o$：

$$
v_o=r_mi_x
$$

其中 $r_m$ 叫跨阻或转移电阻，表示控制电流每变化 $1\,\mathrm A$，输出电压变化多少。因为：

$$
r_m=\frac{v_o}{i_x}
$$

所以单位为：

$$
\frac{\mathrm V}{\mathrm A}=\Omega
$$

### 1. 跨阻不是普通电阻

虽然 $r_m$ 与电阻都以欧姆为单位，但二者表达的端口关系不同：普通电阻的电流和电压属于同一只元件的同一组端子；CCVS 在控制端口读取 $i_x$，在另一组输出端口建立 $v_o$。因此 $r_m$ 是跨端口转换比例，不一定对应一只真实电阻。复杂程度不是区分二者的判据。

### 2. 数值与符号

假设：

$$
r_m=2\,\mathrm{k}\Omega,
\qquad
i_x=0.5\,\mathrm{mA}
$$

则：

$$
\begin{aligned}
v_o
&=r_mi_x\\
&=2\,\mathrm{k}\Omega\times0.5\,\mathrm{mA}\\
&=1\,\mathrm V
\end{aligned}
$$

这里可以直接利用：

$$
\mathrm{k}\Omega\times\mathrm{mA}=\mathrm V
$$

因为 $10^3\times10^{-3}=1$。

若：

$$
i_x=-0.25\,\mathrm{mA}
$$

则完整换算为：

$$
\begin{aligned}
v_o
&=2\times10^3\,\Omega\times(-0.25)\times10^{-3}\,\mathrm A\\
&=-0.5\times10^{3-3}\,\Omega\mathrm A\\
&=-0.5\,\mathrm V
\end{aligned}
$$

负号表示实际输出极性与预先标出的参考方向相反。

### 3. 负载功率与实际用途

当 $v_o=1\,\mathrm V$、输出接 $1\,\mathrm{k}\Omega$ 负载时：

$$
i_L=\frac{v_o}{R_L}=\frac{1}{1000}=1\,\mathrm{mA}
$$

$$
P_L=v_oi_L=1\times1\,\mathrm{mA}=1\,\mathrm{mW}
$$

负载能量来自 CCVS 所代表的真实器件背后的独立电源，不是来自控制支路。光电二极管的微小电流转换成便于测量的输出电压，是电流控制电压行为的一个实际例子。

一句话结论：CCVS 按照 $v_o=r_mi_x$ 用一处的控制电流决定另一组端子的输出电压；$r_m$ 虽以欧姆为单位，但它是跨端口转换比例，真实输出能量来自独立供电。

## CCCS：电流控制电流源

CCCS（Current-Controlled Current Source）读取控制支路中的电流 $i_x$，并按照固定比例在另一条输出支路中建立电流 $i_o$：

$$
i_o=\alpha i_x
$$

其中 $\alpha$ 是电流增益，表示输出电流是控制电流的多少倍。因为：

$$
\alpha=\frac{i_o}{i_x}
$$

所以单位为 $\mathrm A/\mathrm A=1$，即没有物理单位。

### 1. 数值与方向

假设：

$$
\alpha=20,
\qquad
i_x=0.1\,\mathrm{mA}
$$

则：

$$
i_o=20\times0.1\,\mathrm{mA}=2\,\mathrm{mA}
$$

若输出接 $1\,\mathrm{k}\Omega$ 负载：

$$
v_o=i_oR_L
=2\,\mathrm{mA}\times1\,\mathrm{k}\Omega
=2\,\mathrm V
$$

$$
P_L=v_oi_o
=2\times2\,\mathrm{mA}
=4\,\mathrm{mW}
$$

若控制电流反向：

$$
i_x=-0.05\,\mathrm{mA}
$$

则：

$$
i_o=20\times(-0.05\,\mathrm{mA})=-1\,\mathrm{mA}
$$

负号表示实际输出电流大小为 $1\,\mathrm{mA}$，方向与输出参考箭头相反。

### 2. 输出电流的能量来源

$i_o$ 可以大于 $i_x$，不是因为控制支路中的电荷被复制，而是因为控制电流只负责决定输出多少；真实输出支路中的电流和能量来自 CCCS 所代表的有源器件背后的独立电源。晶体管的初级模型可以表现为小控制电流决定较大输出电流的 CCCS 行为。

VCCS 与 CCCS 都直接建立输出电流，区别是 VCCS 读取控制电压，CCCS 读取控制电流。

一句话结论：CCCS 按照 $i_o=\alpha i_x$ 用一处的控制电流决定另一条支路的输出电流；负号表示实际方向与参考箭头相反，较大的输出电流与能量来自独立电源。

## 从 VCVS 有源 RC 的物理连接建立节点方程

有源 RC 中，输入 $v_i$ 先控制 VCVS，VCVS 产生 $v_s$，再由 $v_s$ 驱动后面的 RC。对于 $\mu=4$：

$$
v_s=4v_i
$$

因此 RC 左端收到的是 $v_s$，不是 $v_i$。电容电压不能瞬间跟随 $v_s$ 改变，$v_s$ 与 $v_o$ 之间的压差先在电阻中产生电流，再由这股电流改变电容电荷和电压。

### 1. 电阻电流与电容电流

规定电阻电流从 $v_s$ 流向输出节点 $v_o$：

$$
i_R=\frac{v_s-v_o}{R}
$$

输出节点的电容电压为 $v_o$，电容电流为：

$$
i_C=C\frac{\mathrm dv_o}{\mathrm dt}
$$

输出节点只有电阻和电容两条电流路径。由 KCL，流入节点的电阻电流等于流出节点的电容电流：

$$
i_R=i_C
$$

依次代入：

$$
\frac{v_s-v_o}{R}
=C\frac{\mathrm dv_o}{\mathrm dt}
$$

再代入 $v_s=4v_i$：

$$
\frac{4v_i-v_o}{R}
=C\frac{\mathrm dv_o}{\mathrm dt}
$$

两边乘以 $R$：

$$
4v_i-v_o
=RC\frac{\mathrm dv_o}{\mathrm dt}
$$

移项得到：

$$
4v_i
=v_o+RC\frac{\mathrm dv_o}{\mathrm dt}
$$

### 2. 具体数值验证

取：

$$
v_i=0.5\,\mathrm V,
\qquad v_o=1\,\mathrm V
$$

则：

$$
v_s=4v_i=2\,\mathrm V
$$

电阻电流为：

$$
i_R=\frac{2-1}{2000}=0.5\,\mathrm{mA}
$$

因为：

$$
C\frac{\mathrm dv_o}{\mathrm dt}=i_R
$$

所以：

$$
\begin{aligned}
\frac{\mathrm dv_o}{\mathrm dt}
&=\frac{0.5\times10^{-3}}{0.5\times10^{-6}}\\
&=1000\,\mathrm{V/s}
\end{aligned}
$$

此时 $v_s>v_o$，电流流入电容，$v_o$ 正在上升。代回节点方程：

$$
RC=2000\times0.5\times10^{-6}=0.001\,\mathrm s
$$

$$
v_o+RC\frac{\mathrm dv_o}{\mathrm dt}
=1+0.001\times1000
=2\,\mathrm V
=4v_i
$$

### 3. 为什么追上以后停止变化

当 $v_s=v_o=2\,\mathrm V$ 时：

$$
i_R=\frac{v_s-v_o}{R}=0
$$

由 KCL：

$$
i_C=i_R=0
$$

又因为：

$$
i_C=\frac{\mathrm dq}{\mathrm dt}
$$

所以电荷不再变化。由 $q=Cv_o$：

$$
i_C=C\frac{\mathrm dv_o}{\mathrm dt}=0
$$

因此：

$$
\frac{\mathrm dv_o}{\mathrm dt}=0
$$

这不是电容达到绝对的容量上限，而是与当前 $v_s$ 达到平衡。如果 $v_o=2\,\mathrm V$ 时，$v_s$ 降到 $1\,\mathrm V$：

$$
i_R=\frac{1-2}{2000}=-0.5\,\mathrm{mA}
$$

负号表示实际电流反向，电容放电，$v_o$ 随后下降。

一句话结论：VCVS 先产生 $v_s=4v_i$；$v_s-v_o$ 决定电阻电流，电阻电流再决定电容电荷和 $v_o$ 的变化，因此节点方程为 $4v_i=v_o+RC\,\mathrm dv_o/\mathrm dt$。

## 从有源 RC 节点方程重新推导频率响应

有源 RC 的时域节点方程为：

$$
4v_i=v_o+RC\frac{\mathrm dv_o}{\mathrm dt}
$$

为了研究角频率为 $\omega$ 的正弦稳态，使用复指数形式：

$$
\tilde v_i(t)=\underline V_i e^{j\omega t},
\qquad
\tilde v_o(t)=\underline V_o e^{j\omega t}
$$

线性电路进入正弦稳态后，输入与输出具有相同的 $e^{j\omega t}$ 时间因子；幅度和相位的差别分别记录在 $\underline V_i$ 和 $\underline V_o$ 中。

### 1. 求导为什么变成乘以 $j\omega$

$$
\begin{aligned}
\frac{\mathrm d\tilde v_o}{\mathrm dt}
&=\frac{\mathrm d}{\mathrm dt}
\left(\underline V_o e^{j\omega t}\right)\\
&=\underline V_o\frac{\mathrm d}{\mathrm dt}e^{j\omega t}\\
&=j\omega\underline V_o e^{j\omega t}
\end{aligned}
$$

因此，对于当前选定的复指数信号：

$$
\frac{\mathrm d}{\mathrm dt}\longrightarrow j\omega
$$

这不是任意替换规则，而是因为 $e^{j\omega t}$ 求导以后仍是自身，只多出系数 $j\omega$。

### 2. 消去共同时间因子

将复指数输入和输出代回节点方程：

$$
4\underline V_i e^{j\omega t}
=\underline V_o e^{j\omega t}
+RCj\omega\underline V_o e^{j\omega t}
$$

右边提取共同因子：

$$
4\underline V_i e^{j\omega t}
=\underline V_o e^{j\omega t}(1+j\omega RC)
$$

因为 $e^{j\omega t}$ 永不为零，等式两边同时除以它：

$$
4\underline V_i
=\underline V_o(1+j\omega RC)
$$

整理得到：

$$
\frac{\underline V_o}{\underline V_i}
=\frac{4}{1+j\omega RC}
$$

定义：

$$
H(j\omega)=\frac{\underline V_o}{\underline V_i}
$$

最终：

$$
H(j\omega)=\frac{4}{1+j\omega RC}
$$

### 3. 在 $\omega=1000\,\mathrm{rad/s}$ 验证

本例 $RC=0.001\,\mathrm s$，因此：

$$
\omega RC=1000\times0.001=1
$$

$$
\begin{aligned}
H(j1000)
&=\frac{4}{1+j}\\
&=\frac{4(1-j)}{(1+j)(1-j)}\\
&=2-j2
\end{aligned}
$$

所以：

$$
|H|=\sqrt{2^2+(-2)^2}=2\sqrt2\approx2.83
$$

$$
\angle H=-45^\circ
$$

### 4. 用物理过程验证 $H(0)=4$

当 $\omega=0$ 时输入保持不变，稳定后：

$$
\frac{\mathrm dv_o}{\mathrm dt}=0
$$

所以：

$$
i_C=C\frac{\mathrm dv_o}{\mathrm dt}=0
$$

由输出节点 KCL，$i_R=i_C=0$。而：

$$
i_R=\frac{v_s-v_o}{R}=0
$$

因此：

$$
v_o=v_s=4v_i
$$

例如 $v_i=0.5\,\mathrm V$ 时，$v_s=2\,\mathrm V$。若假设 $v_o$ 稳定在 $1.8\,\mathrm V$，则：

$$
i_R=\frac{2-1.8}{2000}=0.1\,\mathrm{mA}
$$

仍有电流给电容充电，因此 $\mathrm dv_o/\mathrm dt\neq0$，$1.8\,\mathrm V$ 不可能是稳定值。只有 $v_o=2\,\mathrm V$ 时压差、电流和电压变化率才同时为零。

一句话结论：对正弦稳态使用复指数后，求导变成乘以 $j\omega$，消去输入输出共有的 $e^{j\omega t}$，便从节点方程得到 $H(j\omega)=4/(1+j\omega RC)$；$H(0)=4$ 也能由稳定时电阻电流为零推出。

## Nyquist 正频率轨迹：从扫频点到下半圆

令归一化频率：

$$
x=\omega RC=\frac{\omega}{\omega_p}
$$

有源 RC 的频率响应为：

$$
H(j\omega)=\frac{4}{1+jx}
$$

分子分母同乘 $1-jx$：

$$
\begin{aligned}
H(j\omega)
&=\frac{4(1-jx)}{(1+jx)(1-jx)}\\
&=\frac{4(1-jx)}{1+x^2}\\
&=\frac{4}{1+x^2}-j\frac{4x}{1+x^2}
\end{aligned}
$$

因此：

$$
\operatorname{Re}H=\frac{4}{1+x^2},
\qquad
\operatorname{Im}H=-\frac{4x}{1+x^2}
$$

### 1. 五个正频率点与方向

| $x$ | $H(j\omega)$ | 复平面坐标 |
| ---: | ---: | ---: |
| $0$ | $4$ | $(4,0)$ |
| $0.1$ | $3.960-j0.396$ | $(3.960,-0.396)$ |
| $1$ | $2-j2$ | $(2,-2)$ |
| $10$ | $0.0396-j0.396$ | $(0.0396,-0.396)$ |
| $\to\infty$ | $\to0$ | $(0,0)$ |

当 $x\geq0$ 时，$\operatorname{Re}H\geq0$ 且 $\operatorname{Im}H\leq0$，因此正频率轨迹位于复平面下半部。频率增加时，点从 $(4,0)$ 出发，向下经过 $(2,-2)$，再向上趋近 $(0,0)$；相对圆心的移动方向为顺时针。

坐标 $(2,-2)$ 表示 $H$ 的实部为 2、虚部为 $-2$。幅度和角度由两个坐标共同计算：

$$
|H|=\sqrt{2^2+(-2)^2}=2\sqrt2
$$

$$
\angle H=\operatorname{atan2}(-2,2)=-45^\circ
$$

### 2. 消去频率参数，证明轨迹是圆

为了避免把归一化频率 $x$ 与横坐标混淆，定义：

$$
a=\operatorname{Re}H=\frac{4}{1+x^2}
$$

$$
b=\operatorname{Im}H=-\frac{4x}{1+x^2}
$$

两个坐标平方后相加：

$$
\begin{aligned}
a^2+b^2
&=\left(\frac{4}{1+x^2}\right)^2
+\left(-\frac{4x}{1+x^2}\right)^2\\
&=\frac{16+16x^2}{(1+x^2)^2}\\
&=\frac{16(1+x^2)}{(1+x^2)^2}\\
&=\frac{16}{1+x^2}
\end{aligned}
$$

又因为：

$$
a=\frac{4}{1+x^2}
$$

所以：

$$
a^2+b^2=4a
$$

移项并配方：

$$
a^2-4a+b^2=0
$$

$$
(a-2)^2-4+b^2=0
$$

最终：

$$
(a-2)^2+b^2=2^2
$$

因此完整圆的圆心为 $(2,0)$，半径为 2。圆方程本身包含上下两个半圆；再结合正频率下 $b\leq0$，才能确定 $\omega\geq0$ 对应下半圆。

一句话结论：正频率扫频把 $H(j\omega)$ 从 $(4,0)$ 沿顺时针方向带到 $(0,0)$；消去频率参数后得到 $(\operatorname{Re}H-2)^2+(\operatorname{Im}H)^2=4$，结合虚部非正可知轨迹是圆心 $(2,0)$、半径 2 的下半圆。

## 负频率、共轭镜像与完整 Nyquist 轨迹

完整频率轨迹通常令 $\omega$ 从 $-\infty$ 扫到 $+\infty$。负频率来自复指数表示：

$$
e^{j\omega t}=\cos(\omega t)+j\sin(\omega t)
$$

$$
e^{-j\omega t}=\cos(\omega t)-j\sin(\omega t)
$$

二者代表复平面中方向相反的旋转，而真实余弦由二者共同组成：

$$
\cos(\omega t)
=\frac12e^{j\omega t}+\frac12e^{-j\omega t}
$$

因此负频率不是另一种物理振动，而是用复指数完整表示真实正弦信号时自然出现的另一半。

### 1. 实系数系统的共轭对称

本例：

$$
H(j\omega)=\frac{4}{1+j\omega RC}
$$

将频率换成 $-\omega$：

$$
H(-j\omega)=\frac{4}{1-j\omega RC}
$$

对正频率响应取复共轭：

$$
\begin{aligned}
H(j\omega)^*
&=\left(\frac{4}{1+j\omega RC}\right)^*\\
&=\frac{4}{1-j\omega RC}
\end{aligned}
$$

所以：

$$
H(-j\omega)=H(j\omega)^*
$$

复共轭使实部保持不变、虚部反号，因此负频率点与正频率点关于实轴镜像。例如：

$$
H(j\omega_p)=2-j2
$$

$$
H(-j\omega_p)=2+j2
$$

对应坐标为 $(2,-2)$ 和 $(2,2)$。

### 2. 完整扫频的闭合方向

按 $\omega:-\infty\to+\infty$ 扫频：

$$
(0,0)
\overset{\omega<0}{\longrightarrow}
(2,2)
\longrightarrow
(4,0)
\overset{\omega>0}{\longrightarrow}
(2,-2)
\longrightarrow
(0,0)
$$

负频率从原点沿上半圆到达 $(4,0)$，正频率再沿下半圆返回原点，两部分合成一条顺时针闭合圆轨迹。

一句话结论：实系数系统满足 $H(-j\omega)=H(j\omega)^*$，所以负频率轨迹是正频率轨迹关于实轴的镜像；从 $-\infty$ 扫到 $+\infty$ 时，两部分共同组成闭合轨迹。

## 普通频率响应与反馈环路增益不是同一个对象

当前无反馈的有源 RC 描述输入 $v_i$ 到输出 $v_o$ 的关系：

$$
H(s)=\frac{V_o(s)}{V_i(s)}=\frac{4}{1+sRC}
$$

$H(j\omega)$ 回答的是：指定频率的输入经过该模块后，输出的幅度和相位怎样变化。它的 Nyquist 图只是把这组输入输出频率响应画到复平面上。

反馈系统则包含前向通路 $A(s)$、反馈网络 $\beta(s)$ 和比较点。本文固定采用：

$$
T(s)=-A(s)\beta(s)
$$

其中负号来自比较点的相减。$T(s)$ 表示一个信号沿反馈环路完整走一圈后，返回比较点时相对出发信号的复数倍数。

### 1. 闭环传递函数

设：

$$
e=r-\beta y
$$

$$
y=Ae
$$

代入：

$$
y=A(r-\beta y)
$$

展开并整理：

$$
y=Ar-A\beta y
$$

$$
y(1+A\beta)=Ar
$$

所以：

$$
\frac{y}{r}=\frac{A}{1+A\beta}
$$

由 $T=-A\beta$：

$$
1+A\beta=1-T
$$

因此闭环传递函数为：

$$
A_{CL}(s)=\frac{A(s)}{1-T(s)}
$$

### 2. 用有源 RC 举例区分 $A$ 与 $T$

若当前有源 RC 作为前向通路：

$$
A(s)=\frac{4}{1+sRC}
$$

取反馈网络：

$$
\beta(s)=\frac14
$$

则：

$$
\begin{aligned}
T(s)
&=-A(s)\beta(s)\\
&=-\frac{4}{1+sRC}\times\frac14\\
&=-\frac{1}{1+sRC}
\end{aligned}
$$

在直流处：

$$
A(0)=4,
\qquad
T(0)=-1
$$

所以前向模块的 Nyquist 轨迹与完整环路增益的 Nyquist 轨迹不是同一个对象。

### 3. 本文符号下的临界点

闭环分母为 $1-T(s)$。临界条件是：

$$
1-T(j\omega)=0
$$

因此：

$$
T(j\omega)=1
$$

即：

$$
|T(j\omega)|=1,
\qquad
\angle T(j\omega)=360^\circ
$$

所以本文的 Nyquist 临界点是 $1$，不是 $-1$，不能切换到把环路增益定义为 $A\beta$ 的另一套符号。

需要保留一个限定：普通传递函数的极点仍可用于判断该模块自身是否稳定；错误的是把任意普通 $H(j\omega)$ 的 Nyquist 轨迹直接与反馈临界点比较，以此判断闭环反馈稳定性。闭环 Nyquist 判断必须分析决定闭环分母 $1-T$ 的环路增益 $T(j\omega)$。

一句话结论：$H(j\omega)$ 描述某个模块的输入输出响应，$T(j\omega)=-A(j\omega)\beta(j\omega)$ 描述反馈信号绕环路一周的变化；本文的闭环分母是 $1-T$，所以反馈稳定性分析使用 $T$，临界点为 $1$。

## 幅角原理与奈奎斯特稳定判据

### 1. 多个零点和极点的相角为什么能够相加

将有理函数写成：

$$
F(s)=K\frac{\prod_i(s-z_i)}{\prod_i(s-p_i)}
$$

因为复数相乘时相角相加，相除时相角相减：

$$
\arg F(s)
=\arg K+\sum_i\arg(s-z_i)-\sum_i\arg(s-p_i)
$$

让 $s$ 沿逆时针闭合路径 $\Gamma$ 走一圈。一个内部零点使相角增加 $360^\circ$，一个内部极点因为位于分母而使相角减少 $360^\circ$，外部零点和极点的净贡献为 0。因此：

$$
\Delta_\Gamma\arg F(s)=360^\circ(Z-P)
$$

令 $N$ 为映射轨迹逆时针绕原点的净圈数：

$$
N=Z-P
$$

例如路径内有两个零点和一个极点时：

$$
N=2-1=1
$$

映射轨迹逆时针净绕原点一圈。

### 2. 接回反馈系统

本文使用：

$$
T(s)=-A(s)\beta(s)
$$

$$
A_{CL}(s)=\frac{A(s)}{1-T(s)}
$$

令：

$$
F(s)=1-T(s)
$$

则 $F$ 在右半平面的零点数 $Z$ 就是闭环右半平面极点数，$F$ 在右半平面的极点数 $P$ 一般就是开环右半平面极点数。幅角原理给出：

$$
N=Z-P
$$

所以：

$$
Z=N+P
$$

闭环稳定要求 $Z=0$，因此：

$$
N=-P
$$

例如 $P=0$ 时，轨迹不能净绕临界点；$P=1$ 时，轨迹必须顺时针净绕临界点一圈。

### 3. 为什么临界点是 1

因为：

$$
F(s)=1-T(s)=-(T(s)-1)
$$

$F$ 平面的原点对应 $T$ 平面的点 1。乘以 $-1$ 只旋转 $180^\circ$，不改变绕圈数，因此 $F$ 绕原点等价于 $T$ 绕点 1。

振荡临界条件：

$$
|T(j\omega)|=1,
\qquad
\angle T(j\omega)=360^\circ
$$

等价于：

$$
T(j\omega)=1
$$

此时奈奎斯特轨迹经过临界点 1，$F(j\omega)=0$，闭环极点落在虚轴上。

一句话结论：奈奎斯特稳定判据不是只看轨迹有没有碰到临界点，而是根据 $T(\Gamma_R)$ 绕点 1 的净圈数 $N$，再结合开环右半平面极点数 $P$，算出闭环右半平面极点数 $Z=N+P$。

## 当前实际进度：两个零点因子的相角为什么相加

> 本节是当前真实学习进度；前文“幅角原理与奈奎斯特稳定判据”属于旧预览，不能据此视为已经掌握完整判据。

从只含两个零点因子的函数开始：

$$
F(s)=(s-z_1)(s-z_2)
$$

对路径上的同一个点 $s$，定义两根复数向量：

$$
w_1=s-z_1,
\qquad
w_2=s-z_2
$$

把它们写成极坐标形式：

$$
w_1=r_1(\cos\theta_1+j\sin\theta_1)
$$

$$
w_2=r_2(\cos\theta_2+j\sin\theta_2)
$$

其中 $r_1,r_2$ 是模长，$\theta_1,\theta_2$ 是相角。于是：

$$
\begin{aligned}
F(s)
&=w_1w_2\\
&=r_1r_2(\cos\theta_1+j\sin\theta_1)
(\cos\theta_2+j\sin\theta_2)\\
&=r_1r_2\bigl[
\cos\theta_1\cos\theta_2-
\sin\theta_1\sin\theta_2\\
&\qquad\qquad+j(\sin\theta_1\cos\theta_2+
\cos\theta_1\sin\theta_2)
\bigr]\\
&=r_1r_2\bigl[
\cos(\theta_1+\theta_2)
+j\sin(\theta_1+\theta_2)
\bigr]
\end{aligned}
$$

所以乘积的模长为 $r_1r_2$，相角为两根向量相角之和：

$$
\arg F(s)
=\arg(s-z_1)+\arg(s-z_2)
\pmod{360^\circ}
$$

为了跟踪路径运动造成的累计相角变化，要使用连续展开的相角，而不是每次都把显示值折回 $(-180^\circ,180^\circ]$。因此路径前进时：

$$
\Delta\arg F
=\Delta\arg(s-z_1)+\Delta\arg(s-z_2)
$$

### 具体数值验证

取：

$$
s=3+j2,
\qquad
z_1=1+j,
\qquad
z_2=2
$$

两根向量分别为：

$$
s-z_1=(3+j2)-(1+j)=2+j
$$

$$
s-z_2=(3+j2)-2=1+j2
$$

它们的模长和相角为：

| 向量 | 模长 | 相角 |
| --- | ---: | ---: |
| $s-z_1=2+j$ | $\sqrt5$ | $\arctan(1/2)\approx26.565^\circ$ |
| $s-z_2=1+j2$ | $\sqrt5$ | $\arctan(2)\approx63.435^\circ$ |

直接相乘：

$$
\begin{aligned}
F(s)
&=(2+j)(1+j2)\\
&=2+j4+j+j^2 2\\
&=2+j5-2\\
&=j5
\end{aligned}
$$

乘积 $j5$ 的模长为 $5$，相角为 $90^\circ$。另一方面：

$$
\sqrt5\times\sqrt5=5
$$

$$
26.565^\circ+63.435^\circ=90^\circ
$$

数值结果同时验证了模长相乘和相角相加。

一句话结论：$F(s)$ 是两根复数向量的乘积；复数乘法把缩放倍数相乘、把旋转角度相加，所以两个零点因子对 $F(s)$ 的相角贡献能够直接相加。

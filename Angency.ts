namespace Rstate
{
    export type AngencyHandle=(aobj:Angency)=>void;
    enum InnerEventType
    {
        Changed,
        Deleted,
        preparRead
    }
    /**
     * 此类用于代理一个对象
     * 其保存一个对象的引用和其父对象的引用
     * 同时保存一个对象的标记号(sign)
     * 提供对对象的监视功能
     * 当发生一个事件时 它调用对应的监视函数
     * 同时通知其父对象（如果有的话)
     */
    export class Angency
    {
        public OnChanged:AngencyHandle[]=[];
        public OnDeleted:AngencyHandle[]=[];
        public preparRead:AngencyHandle[]=[];
        public StartEvent(type:InnerEventType)
        {
            let handles:AngencyHandle[]=null;
            switch(type)
            {
                case InnerEventType.Changed:
                handles=this.OnChanged;
                break;
                case InnerEventType.Deleted:
                handles=this.OnDeleted;
                break;
                case InnerEventType.preparRead:
                handles=this.preparRead;
                break;
            }
            //先调用直接监视
            for(let f of handles)
            {
                f(this);
            }
            //通知父对象
            this.ContainerObject.ReceiveEvent(type,this);
        }
        protected ReceiveEvent(type:InnerEventType,childobj:Angency)
        {
            //这里写最简单的逻辑 即下级改变 上级也表示改变
            this.StartEvent(type);
        }
        public constructor(public AngencyObject:any,public ObjectSign:any,public ContainerObject:Angency)
        {

        }
        public get Value()
        {
            for(let a of this.preparRead) a(this);
            return this.AngencyObject;
        }
        public set Value(value:any)
        {
            this.AngencyObject=value;
            //通知改变
            this.StartEvent(InnerEventType.Changed);
        }
        public HadDelete()
        {
            //通知
            this.StartEvent(InnerEventType.Deleted);
        }
        
    }
}
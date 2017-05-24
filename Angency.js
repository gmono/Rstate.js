var Rstate;
(function (Rstate) {
    var InnerEventType;
    (function (InnerEventType) {
        InnerEventType[InnerEventType["Changed"] = 0] = "Changed";
        InnerEventType[InnerEventType["Deleted"] = 1] = "Deleted";
        InnerEventType[InnerEventType["preparRead"] = 2] = "preparRead";
    })(InnerEventType || (InnerEventType = {}));
    /**
     * 此类用于代理一个对象
     * 其保存一个对象的引用和其父对象的引用
     * 同时保存一个对象的标记号(sign)
     * 提供对对象的监视功能
     * 当发生一个事件时 它调用对应的监视函数
     * 同时通知其父对象（如果有的话)
     */
    var Angency = (function () {
        function Angency(AngencyObject, ObjectSign, ContainerObject) {
            this.AngencyObject = AngencyObject;
            this.ObjectSign = ObjectSign;
            this.ContainerObject = ContainerObject;
            this.OnChanged = [];
            this.OnDeleted = [];
            this.preparRead = [];
        }
        Angency.prototype.StartEvent = function (type) {
            var handles = null;
            switch (type) {
                case InnerEventType.Changed:
                    handles = this.OnChanged;
                    break;
                case InnerEventType.Deleted:
                    handles = this.OnDeleted;
                    break;
                case InnerEventType.preparRead:
                    handles = this.preparRead;
                    break;
            }
            //先调用直接监视
            for (var _i = 0, handles_1 = handles; _i < handles_1.length; _i++) {
                var f = handles_1[_i];
                f(this);
            }
            //通知父对象
            this.ContainerObject.ReceiveEvent(type, this);
        };
        Angency.prototype.ReceiveEvent = function (type, childobj) {
            //这里写最简单的逻辑 即下级改变 上级也表示改变
            this.StartEvent(type);
        };
        Object.defineProperty(Angency.prototype, "Value", {
            get: function () {
                for (var _i = 0, _a = this.preparRead; _i < _a.length; _i++) {
                    var a = _a[_i];
                    a(this);
                }
                return this.AngencyObject;
            },
            set: function (value) {
                this.AngencyObject = value;
                //通知改变
                this.StartEvent(InnerEventType.Changed);
            },
            enumerable: true,
            configurable: true
        });
        Angency.prototype.HadDelete = function () {
            //通知
            this.StartEvent(InnerEventType.Deleted);
        };
        return Angency;
    }());
    Rstate.Angency = Angency;
})(Rstate || (Rstate = {}));
